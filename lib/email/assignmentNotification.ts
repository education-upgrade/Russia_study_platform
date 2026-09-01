import { createClient } from '@supabase/supabase-js';

type NotificationInput = {
  assignmentId: string;
  assignmentTitle: string;
  lessonTitle: string;
  instructions: string | null;
  dueAt: string | null;
  appOrigin: string;
};

export type NotificationResult = {
  attempted: number;
  sent: number;
  failed: number;
  skipped: boolean;
  reason?: string;
};

function formatDeadline(value: string | null) {
  if (!value) return 'No deadline has been set.';
  return new Date(value).toLocaleString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London',
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character] ?? character));
}

export async function sendAssignmentNotifications(input: NotificationInput): Promise<NotificationResult> {
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.ASSIGNMENT_EMAIL_FROM;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!resendKey || !from) return { attempted: 0, sent: 0, failed: 0, skipped: true, reason: 'Assignment email is not configured.' };
  if (!supabaseUrl || !serviceRoleKey) return { attempted: 0, sent: 0, failed: 0, skipped: true, reason: 'Secure recipient lookup is not configured.' };

  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: recipients, error } = await admin.from('assignment_recipients').select('student_id').eq('assignment_id', input.assignmentId).eq('status', 'assigned');
  if (error) throw new Error(`Could not load assignment recipients: ${error.message}`);

  const ids = [...new Set((recipients ?? []).map((row: { student_id: string }) => row.student_id))];
  if (!ids.length) return { attempted: 0, sent: 0, failed: 0, skipped: false };

  const users = await Promise.all(ids.map(async (id) => {
    const { data, error: userError } = await admin.auth.admin.getUserById(id);
    if (userError) return null;
    return data.user?.email ? { id, email: data.user.email } : null;
  }));

  const deadline = formatDeadline(input.dueAt);
  const instructions = input.instructions?.trim() || 'Complete the assignment activities shown in your guided study pathway.';
  const assignmentUrl = `${input.appOrigin.replace(/\/$/, '')}/student/my-work`;
  const subject = `New assignment: ${input.lessonTitle}`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#14213d;line-height:1.55"><p style="font-size:12px;letter-spacing:.12em;font-weight:700;color:#64748b">EDUCATION UPGRADE</p><h1 style="font-size:26px;margin-bottom:8px">New assignment</h1><h2 style="font-size:20px;margin-top:0">${escapeHtml(input.lessonTitle)}</h2><p>Your teacher has set new guided study work.</p><p><strong>Instructions</strong><br>${escapeHtml(instructions).replace(/\n/g, '<br>')}</p><p><strong>Deadline</strong><br>${escapeHtml(deadline)}</p><p><a href="${escapeHtml(assignmentUrl)}" style="display:inline-block;background:#14213d;color:white;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:700">Open my work</a></p><p style="font-size:13px;color:#64748b">Sign in to Education Upgrade to open the assignment and track your progress.</p></div>`;
  const text = `New assignment: ${input.lessonTitle}\n\nInstructions: ${instructions}\n\nDeadline: ${deadline}\n\nOpen your work: ${assignmentUrl}`;

  let sent = 0;
  let failed = 0;
  for (const user of users) {
    if (!user) { failed += 1; continue; }
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: [user.email], subject, html, text }),
      });
      if (response.ok) sent += 1;
      else { failed += 1; console.error('Assignment email failed', response.status, await response.text()); }
    } catch (emailError) {
      failed += 1;
      console.error('Assignment email failed', emailError);
    }
  }

  return { attempted: ids.length, sent, failed, skipped: false };
}

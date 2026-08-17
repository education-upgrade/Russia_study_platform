'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  classId: string;
  studentId: string;
  assignments: { id: string; title: string }[];
};

export default function TeacherStudentNoteForm({ classId, studentId, assignments }: Props) {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [assignmentId, setAssignmentId] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) return;
    setSaving(true);
    setMessage('');
    const response = await fetch(`/api/teacher/classes/${classId}/students/${studentId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body, assignmentId: assignmentId || null }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(result.error || 'Note could not be saved.');
      setSaving(false);
      return;
    }
    setBody('');
    setAssignmentId('');
    setMessage('Saved.');
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
      <label style={{ display: 'grid', gap: 6 }}>
        <strong>Attach note to</strong>
        <select value={assignmentId} onChange={(event) => setAssignmentId(event.target.value)} style={{ minHeight: 44, padding: '10px 12px', borderRadius: 12, border: '1px solid var(--border)', background: '#fff' }}>
          <option value="">Student generally</option>
          {assignments.map((assignment) => <option key={assignment.id} value={assignment.id}>{assignment.title}</option>)}
        </select>
      </label>
      <label style={{ display: 'grid', gap: 6 }}>
        <strong>Private teacher note</strong>
        <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={4} maxLength={4000} placeholder="e.g. Strong factual knowledge; prompt for more explicit judgement next time." style={{ padding: 12, borderRadius: 12, border: '1px solid var(--border)', resize: 'vertical', font: 'inherit' }} />
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <button type="submit" disabled={saving || !body.trim()} style={{ minHeight: 42, padding: '9px 16px', border: 0, borderRadius: 999, background: 'var(--navy)', color: '#fff', fontWeight: 850 }}>{saving ? 'Saving…' : 'Add note'}</button>
        {message && <span aria-live="polite" style={{ color: 'var(--muted)', fontWeight: 750 }}>{message}</span>}
      </div>
    </form>
  );
}

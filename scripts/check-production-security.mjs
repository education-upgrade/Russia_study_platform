import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];

function requireText(file, text, message) {
  if (!read(file).includes(text)) failures.push(message);
}

function forbidText(file, text, message) {
  if (read(file).includes(text)) failures.push(message);
}

const joinPage = 'app/join-class/page.tsx';
const joinApi = 'app/api/classes/join/route.ts';
requireText(joinPage, "redirect('/student/join')", 'Legacy /join-class page must redirect to /student/join.');
requireText(joinApi, 'status: 410', 'Legacy class join API must remain retired with HTTP 410.');
forbidText(joinApi, 'DEMO_STUDENT_ID', 'Retired class join API must not restore demo student access.');
forbidText(joinApi, "from '@/lib/supabase'", 'Retired class join API must not query the legacy database directly.');

const selfStudyRoutes = [
  'app/api/student-responses/activity/route.ts',
  'app/api/student-responses/confidence/route.ts',
  'app/api/student-responses/flashcards/route.ts',
  'app/api/student-responses/lesson/route.ts',
  'app/api/student-responses/peel/route.ts',
  'app/api/student-responses/quiz/route.ts',
];

for (const file of selfStudyRoutes) {
  requireText(file, 'getLegacySelfStudyAccess', `${file} must require authenticated server-side legacy access.`);
  forbidText(file, "from '@/lib/supabase'", `${file} must not use the anonymous Supabase client.`);
}

forbidText(
  'lib/resolveVirtualActivityId.ts',
  "from './supabase'",
  'Virtual activity materialisation must not use the anonymous Supabase client.',
);

forbidText(
  'app/api/guided-study/route.ts',
  "from('guided_study_assignments')",
  'Assignment publishing must not fall back to the prototype guided_study_assignments table.',
);

const migration = 'supabase/migrations/20260904113000_lock_down_legacy_demo_surface.sql';
if (!fs.existsSync(path.join(root, migration))) {
  failures.push('Legacy-surface lockdown migration is missing.');
} else {
  requireText(migration, 'revoke select, insert, update, delete on public.student_responses', 'Legacy response table must be revoked from browser roles.');
  requireText(migration, 'revoke execute on function %I.%I(%s) from public, anon', 'SECURITY DEFINER functions must lose PUBLIC/anon execute access.');
}

const loginForm = 'app/login/LoginForm.tsx';
requireText(loginForm, 'safeLocalPath', 'Login redirects must be sanitised to a local path.');
requireText(loginForm, 'if (data.session)', 'Student signup must handle confirmation-off sessions without asking for email confirmation.');
requireText(loginForm, 'href="/privacy"', 'Login and signup must provide a visible privacy-notice link.');
forbidText(loginForm, 'SUPABASE_SERVICE_ROLE_KEY', 'Client authentication code must never reference the Supabase service-role key.');
forbidText(loginForm, 'body: JSON.stringify({ email, password, fullName, staffCode, callbackUrl })', 'Staff signup must not trust a client-supplied callback URL.');

const browserSupabase = 'lib/supabase/browser.ts';
forbidText(browserSupabase, 'SUPABASE_SERVICE_ROLE_KEY', 'Browser Supabase client must never expose the service-role key.');

const privacyPage = 'app/privacy/page.tsx';
if (!fs.existsSync(path.join(root, privacyPage))) {
  failures.push('Public privacy notice page is missing.');
} else {
  requireText(privacyPage, 'controlled educational pilot', 'Privacy notice must explain the controlled educational pilot.');
  requireText(privacyPage, 'Do not enter safeguarding information', 'Privacy notice must warn against entering sensitive safeguarding/medical data.');
}

const staffSignup = 'app/api/auth/staff-signup/route.ts';
requireText(staffSignup, 'consume_staff_signup_rate_limit', 'Staff signup must remain rate limited.');
requireText(staffSignup, 'timingSafeEqual', 'Staff invite codes must use constant-time comparison.');
requireText(staffSignup, 'safeLocalPath', 'Staff signup redirects must remain local-only.');

const rateLimitMigration = 'supabase/migrations/20260904133000_add_staff_signup_rate_limit.sql';
if (!fs.existsSync(path.join(root, rateLimitMigration))) {
  failures.push('Staff-signup rate-limit migration is missing.');
} else {
  requireText(rateLimitMigration, 'revoke execute on function public.consume_staff_signup_rate_limit', 'Staff signup rate limiter must not be browser-callable.');
  requireText(rateLimitMigration, 'to service_role', 'Staff signup rate limiter must be service-role only.');
}

const assignmentForm = 'components/GuidedStudyAssignmentForm.tsx';
requireText(assignmentForm, "useState(initialClass?.id ?? '')", 'Generic Set Work must not silently preselect the newest class.');
requireText(assignmentForm, "useState(initialTopic?.pathwaySlug ?? '')", 'Generic Set Work must not silently preselect a topic.');
requireText(assignmentForm, 'disabled={!canConfigure}', 'Assignment configuration must stay locked until class and topic are chosen.');
forbidText(assignmentForm, '?? classOptions[0]', 'Assignment builder must not restore a silent first-class fallback.');

const authAccess = 'lib/auth/access.ts';
const clearSessionRoute = 'app/auth/clear-session/route.ts';
requireText(authAccess, 'isStaleSessionError', 'Stale-session handling must remain limited to auth-session errors.');
requireText(authAccess, "redirect('/auth/clear-session')", 'Stale Supabase sessions must route through cookie cleanup.');
if (!fs.existsSync(path.join(root, clearSessionRoute))) {
  failures.push('Stale-session cookie cleanup route is missing.');
} else {
  requireText(clearSessionRoute, "cookie.name.startsWith('sb-')", 'Stale-session cleanup must only target Supabase cookies.');
  requireText(clearSessionRoute, "cookie.name.includes('auth-token')", 'Stale-session cleanup must only target Supabase auth cookies.');
  requireText(clearSessionRoute, 'maxAge: 0', 'Stale Supabase auth cookies must be expired during cleanup.');
}

const schoolTime = 'lib/dateTime.ts';
requireText(schoolTime, "SCHOOL_TIME_ZONE = 'Europe/London'", 'School-facing dates must remain pinned to Europe/London.');

if (failures.length) {
  console.error('Production security check failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log('Production security checks passed.');

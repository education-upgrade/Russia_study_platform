import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const absolute = (file) => path.join(root, file);
const read = (file) => fs.readFileSync(absolute(file), 'utf8');
const write = (file, content) => {
  fs.mkdirSync(path.dirname(absolute(file)), { recursive: true });
  fs.writeFileSync(absolute(file), content, 'utf8');
};
const remove = (file) => {
  if (fs.existsSync(absolute(file))) fs.rmSync(absolute(file));
};

function replaceRequired(file, from, to) {
  const source = read(file);
  if (!source.includes(from)) throw new Error(`${file}: expected text was not found.`);
  write(file, source.replace(from, to));
}

function replaceFunctionTryBlock(file, functionMarker, replacement) {
  const source = read(file);
  const functionIndex = source.indexOf(functionMarker);
  if (functionIndex < 0) throw new Error(`${file}: function marker not found: ${functionMarker}`);
  const tryIndex = source.indexOf('    try {', functionIndex);
  const catchIndex = source.indexOf('    } catch (error) {', tryIndex);
  if (tryIndex < 0 || catchIndex < 0) throw new Error(`${file}: try/catch block not found.`);
  write(file, `${source.slice(0, tryIndex)}${replacement}${source.slice(catchIndex)}`);
}

function stripLegacyElse(file, endpoint) {
  const source = read(file);
  const endpointIndex = source.indexOf(endpoint);
  if (endpointIndex < 0) throw new Error(`${file}: legacy endpoint not found: ${endpoint}`);
  const elseStart = source.lastIndexOf('      } else {', endpointIndex);
  const endMarker = "\n      }\n\n      setSaveStatus('saved');";
  const endStart = source.indexOf(endMarker, endpointIndex);
  if (elseStart < 0 || endStart < 0) throw new Error(`${file}: legacy else branch boundaries not found.`);
  const closingLength = '\n      }'.length;
  const next = `${source.slice(0, elseStart)}      }${source.slice(endStart + closingLength)}`;
  write(file, next);
}

function legacyRedirect(target) {
  return `import { redirect } from 'next/navigation';\n\ntype Props = {\n  searchParams: Promise<{ assignment?: string | string[] }>;\n};\n\nexport default async function LegacyWeek1Redirect({ searchParams }: Props) {\n  const { assignment } = await searchParams;\n  const assignmentId = Array.isArray(assignment) ? assignment[0] : assignment;\n  const query = assignmentId ? \`?assignment=\${encodeURIComponent(assignmentId)}\` : '';\n  redirect(\`${target}\${query}\`);\n}\n`;
}

const retiredApi = `import { NextResponse } from 'next/server';\n\nexport async function POST() {\n  return NextResponse.json(\n    { error: 'This legacy self-study save endpoint has been retired. Refresh the page to use the current practice mode.' },\n    { status: 410 },\n  );\n}\n`;

remove('app/diagnostics/page.tsx');
remove('app/data-check/page.tsx');

write('app/student/lesson/week-1/page.tsx', legacyRedirect('/student/lesson/1855'));
write('app/student/lesson/week-1/lesson/page.tsx', legacyRedirect('/student/lesson/1855/lesson'));
write('app/student/lesson/week-1/flashcards/page.tsx', legacyRedirect('/student/lesson/1855/flashcards'));
write('app/student/lesson/week-1/quiz/page.tsx', legacyRedirect('/student/lesson/1855/quiz'));
write('app/student/lesson/week-1/peel/page.tsx', legacyRedirect('/student/lesson/1855/peel'));
write('app/student/lesson/week-1/confidence/page.tsx', legacyRedirect('/student/lesson/1855/confidence'));

for (const file of [
  'app/api/student-responses/activity/route.ts',
  'app/api/student-responses/confidence/route.ts',
  'app/api/student-responses/flashcards/route.ts',
  'app/api/student-responses/lesson/route.ts',
  'app/api/student-responses/peel/route.ts',
  'app/api/student-responses/quiz/route.ts',
]) {
  write(file, retiredApi);
}
remove('lib/legacySelfStudyServer.ts');
remove('lib/resolveVirtualActivityId.ts');

replaceFunctionTryBlock(
  'components/LessonChunkActivity.tsx',
  'async function saveLesson',
  `    try {\n      setSaveStatus('saved');\n      setSaveMessage(finished ? 'Practice lesson complete for this session' : 'Practice progress updated');\n`,
);
replaceRequired(
  'components/LessonChunkActivity.tsx',
  "completionMessage = 'You have worked through all sections and completed the short checks. Your lesson progress has been saved.',",
  "completionMessage = 'You have worked through all sections and completed the short checks for this practice session.',",
);

for (const [file, endpoint] of [
  ['components/FlashcardActivity.tsx', '/api/student-responses/flashcards'],
  ['components/QuizActivity.tsx', '/api/student-responses/quiz'],
  ['components/TimelineActivity.tsx', '/api/student-responses/activity'],
  ['components/CardSortActivity.tsx', '/api/student-responses/activity'],
  ['components/JudgementRankingActivity.tsx', '/api/student-responses/activity'],
  ['components/AO3InterpretationActivity.tsx', '/api/student-responses/activity'],
]) {
  stripLegacyElse(file, endpoint);
}

replaceRequired(
  'components/FlashcardActivity.tsx',
  "      setSaveMessage(complete ? 'Flashcards saved' : 'Saved');",
  `      setSaveMessage(\n        assignmentId\n          ? (complete ? 'Flashcards saved' : 'Saved')\n          : (complete ? 'Practice deck complete for this session' : 'Practice progress updated'),\n      );`,
);
replaceRequired(
  'components/QuizActivity.tsx',
  "      setSaveMessage(isComplete ? `Saved score ${result.score}/${questions.length}` : 'Saved');",
  `      setSaveMessage(\n        assignmentId\n          ? (isComplete ? \`Saved score \${result.score}/\${questions.length}\` : 'Saved')\n          : (isComplete ? \`Practice score \${result.score}/\${questions.length}\` : 'Practice progress updated'),\n      );`,
);
replaceRequired(
  'components/TimelineActivity.tsx',
  "      setSaveMessage(status === 'complete' ? 'Timeline submitted' : 'Saved');",
  `      setSaveMessage(\n        assignmentId\n          ? (status === 'complete' ? 'Timeline submitted' : 'Saved')\n          : (status === 'complete' ? 'Practice timeline complete for this session' : 'Practice progress updated'),\n      );`,
);
replaceRequired(
  'components/CardSortActivity.tsx',
  "      setSaveMessage(status === 'complete' ? 'Card sort submitted' : 'Saved');",
  `      setSaveMessage(\n        assignmentId\n          ? (status === 'complete' ? 'Card sort submitted' : 'Saved')\n          : (status === 'complete' ? 'Practice card sort complete for this session' : 'Practice progress updated'),\n      );`,
);
replaceRequired(
  'components/JudgementRankingActivity.tsx',
  "      setSaveMessage(status === 'complete' ? 'Judgement saved' : 'Saved');",
  `      setSaveMessage(\n        assignmentId\n          ? (status === 'complete' ? 'Judgement saved' : 'Saved')\n          : (status === 'complete' ? 'Practice judgement complete for this session' : 'Practice progress updated'),\n      );`,
);
replaceRequired(
  'components/AO3InterpretationActivity.tsx',
  "      setSaveMessage('Interpretation response saved.');",
  "      setSaveMessage(assignmentId ? 'Interpretation response saved.' : 'Practice interpretation complete for this session.');",
);

replaceFunctionTryBlock(
  'components/PeelResponseActivity.tsx',
  'async function saveResponse',
  `    try {\n      if (assignmentId) {\n        const response = await fetch('/api/assignment-progress', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({\n            assignmentId,\n            activityType: 'peel_response',\n            status: status === 'submitted' ? 'complete' : 'in_progress',\n            position: {\n              responseType: 'written_response',\n              question,\n              point: nextValues.point,\n              evidence: nextValues.evidence,\n              explain: nextValues.explain,\n              link: nextValues.link,\n              fullResponse: nextFullResponse,\n              wordCount: nextWordCount,\n              responseStatus: status,\n              targetWords,\n            },\n          }),\n        });\n        const result = await response.json().catch(() => null);\n        if (!response.ok) throw new Error(result?.error ?? 'Written response could not be saved.');\n      }\n      setSaveStatus('saved');\n      setSaveMessage(\n        status === 'submitted'\n          ? (assignmentId ? 'Submitted — your teacher can view this response.' : 'Practice response complete for this session.')\n          : (assignmentId ? 'Saved' : 'Practice progress updated'),\n      );\n      if (status === 'submitted') setSubmitted(true);\n      return true;\n`,
);
replaceRequired(
  'components/PeelResponseActivity.tsx',
  '<div className={styles.submittedBox}>Submitted. Your teacher can now view this response.</div>',
  "<div className={styles.submittedBox}>{assignmentId ? 'Submitted. Your teacher can now view this response.' : 'Practice response complete for this session.'}</div>",
);

replaceFunctionTryBlock(
  'components/ConfidenceExitTicketActivity.tsx',
  'async function submitTicket',
  `    try {\n      const position = { least_secure_area: leastSecureArea, understand_better: understandBetter.trim(), need_help_with: needHelpWith.trim(), prompt };\n      if (assignmentId) {\n        const response = await fetch('/api/assignment-progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assignmentId, activityType: 'confidence_exit_ticket', status: 'complete', confidence, position }) });\n        const result = await response.json().catch(() => null);\n        if (!response.ok) throw new Error(result?.error ?? 'Confidence exit ticket could not be saved.');\n      }\n      setSubmitted(true);\n      setSaveStatus('saved');\n      setSaveMessage(assignmentId ? 'Saved. Your teacher can view this confidence check.' : 'Practice confidence check complete for this session.');\n`,
);
replaceRequired(
  'components/ConfidenceExitTicketActivity.tsx',
  '<p>Finish the pathway by telling your teacher how secure you feel and what still needs support.</p>',
  "<p>{assignmentId ? 'Finish the pathway by telling your teacher how secure you feel and what still needs support.' : 'Finish the pathway by reflecting on how secure you feel and what still needs support.'}</p>",
);

write('lib/supabase/proxy.ts', `import { createServerClient } from '@supabase/ssr';\nimport { NextResponse, type NextRequest } from 'next/server';\nimport { safeLocalPath } from '@/lib/navigation';\n\nconst protectedPrefixes = ['/student', '/teacher', '/account', '/admin'];\n\nfunction getSupabasePublicKey() {\n  return (\n    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||\n    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY\n  );\n}\n\nfunction nextResponseForRequest(request: NextRequest) {\n  const requestHeaders = new Headers(request.headers);\n  const assignmentId = request.nextUrl.searchParams.get('assignment');\n\n  if (assignmentId) requestHeaders.set('x-assignment-id', assignmentId);\n  else requestHeaders.delete('x-assignment-id');\n\n  return NextResponse.next({ request: { headers: requestHeaders } });\n}\n\nfunction isProtectedPath(pathname: string) {\n  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(\`${prefix}/\`));\n}\n\nfunction hasSupabaseAuthCookie(request: NextRequest) {\n  return request.cookies.getAll().some((cookie) => cookie.name.startsWith('sb-') && cookie.name.includes('auth-token'));\n}\n\nfunction isStaleSessionError(error: unknown) {\n  const candidate = error as { code?: string; message?: string } | null;\n  const code = candidate?.code?.toLowerCase() ?? '';\n  const message = candidate?.message?.toLowerCase() ?? '';\n  return (\n    code.includes('refresh_token') ||\n    code === 'session_not_found' ||\n    message.includes('refresh token') ||\n    message.includes('session not found')\n  );\n}\n\nfunction clearSupabaseAuthCookies(request: NextRequest, targetResponse: NextResponse) {\n  for (const cookie of request.cookies.getAll()) {\n    if (!cookie.name.startsWith('sb-') || !cookie.name.includes('auth-token')) continue;\n    request.cookies.delete(cookie.name);\n    targetResponse.cookies.set(cookie.name, '', { path: '/', maxAge: 0 });\n  }\n}\n\nfunction loginRedirect(request: NextRequest) {\n  const loginUrl = request.nextUrl.clone();\n  loginUrl.pathname = '/login';\n  loginUrl.searchParams.set('next', \`${request.nextUrl.pathname}${request.nextUrl.search}\`);\n  return NextResponse.redirect(loginUrl);\n}\n\nexport async function updateSupabaseSession(request: NextRequest) {\n  const isProtected = isProtectedPath(request.nextUrl.pathname);\n  const isLogin = request.nextUrl.pathname === '/login';\n\n  if (!isProtected && !isLogin) return nextResponseForRequest(request);\n\n  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;\n  const publicKey = getSupabasePublicKey();\n  if (!url || !publicKey) return nextResponseForRequest(request);\n\n  if (!hasSupabaseAuthCookie(request)) {\n    return isProtected ? loginRedirect(request) : nextResponseForRequest(request);\n  }\n\n  let response = nextResponseForRequest(request);\n  const supabase = createServerClient(url, publicKey, {\n    cookies: {\n      getAll() {\n        return request.cookies.getAll();\n      },\n      setAll(cookiesToSet) {\n        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));\n        response = nextResponseForRequest(request);\n        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));\n      },\n    },\n  });\n\n  const { data: { user }, error: authError } = await supabase.auth.getUser();\n  const staleSession = !user && Boolean(authError) && isStaleSessionError(authError);\n  if (staleSession) clearSupabaseAuthCookies(request, response);\n\n  if (!user && isProtected) {\n    const redirectResponse = loginRedirect(request);\n    if (staleSession) clearSupabaseAuthCookies(request, redirectResponse);\n    return redirectResponse;\n  }\n\n  if (user && isLogin) {\n    return NextResponse.redirect(new URL(safeLocalPath(request.nextUrl.searchParams.get('next')), request.url));\n  }\n\n  return response;\n}\n`);

write('scripts/check-production-security.mjs', `import fs from 'node:fs';\nimport path from 'node:path';\n\nconst root = process.cwd();\nconst full = (file) => path.join(root, file);\nconst exists = (file) => fs.existsSync(full(file));\nconst read = (file) => fs.readFileSync(full(file), 'utf8');\nconst failures = [];\n\nfunction requireText(file, text, message) {\n  if (!exists(file) || !read(file).includes(text)) failures.push(message);\n}\n\nfunction forbidText(file, text, message) {\n  if (exists(file) && read(file).includes(text)) failures.push(message);\n}\n\nfunction requireMissing(file, message) {\n  if (exists(file)) failures.push(message);\n}\n\nconst joinPage = 'app/join-class/page.tsx';\nconst joinApi = 'app/api/classes/join/route.ts';\nrequireText(joinPage, "redirect('/student/join')", 'Legacy /join-class page must redirect to /student/join.');\nrequireText(joinApi, 'status: 410', 'Legacy class join API must remain retired with HTTP 410.');\nforbidText(joinApi, 'DEMO_STUDENT_ID', 'Retired class join API must not restore demo student access.');\n\nconst retiredSelfStudyRoutes = [\n  'app/api/student-responses/activity/route.ts',\n  'app/api/student-responses/confidence/route.ts',\n  'app/api/student-responses/flashcards/route.ts',\n  'app/api/student-responses/lesson/route.ts',\n  'app/api/student-responses/peel/route.ts',\n  'app/api/student-responses/quiz/route.ts',\n];\nfor (const file of retiredSelfStudyRoutes) {\n  requireText(file, 'status: 410', `${file} must remain a retired compatibility endpoint.`);\n  for (const marker of ['DEMO_STUDENT_ID', 'DEMO_ASSIGNMENT_ID', 'student_responses', 'guided_study_assignments', 'getLegacySelfStudyAccess', 'resolveVirtualActivityId', 'SUPABASE_SERVICE_ROLE_KEY']) {\n    forbidText(file, marker, `${file} must not restore legacy persistence marker: ${marker}.`);\n  }\n}\nrequireMissing('lib/legacySelfStudyServer.ts', 'Legacy self-study service-role helper must not return to production.');\nrequireMissing('lib/resolveVirtualActivityId.ts', 'Legacy virtual-activity resolver must not return to production.');\n\nfor (const file of ['app/diagnostics/page.tsx', 'app/data-check/page.tsx']) {\n  requireMissing(file, `${file} is a development diagnostic surface and must not ship publicly.`);\n}\n\nconst legacyWeek1Routes = new Map([\n  ['app/student/lesson/week-1/page.tsx', '/student/lesson/1855'],\n  ['app/student/lesson/week-1/lesson/page.tsx', '/student/lesson/1855/lesson'],\n  ['app/student/lesson/week-1/flashcards/page.tsx', '/student/lesson/1855/flashcards'],\n  ['app/student/lesson/week-1/quiz/page.tsx', '/student/lesson/1855/quiz'],\n  ['app/student/lesson/week-1/peel/page.tsx', '/student/lesson/1855/peel'],\n  ['app/student/lesson/week-1/confidence/page.tsx', '/student/lesson/1855/confidence'],\n]);\nfor (const [file, target] of legacyWeek1Routes) {\n  requireText(file, target, `${file} must redirect to the modular 1855 pathway.`);\n  for (const marker of ['DEMO_STUDENT_ID', 'guided_study_assignments', 'student_responses', '/api/student-responses/']) {\n    forbidText(file, marker, `${file} must not restore demo Week 1 runtime state.`);\n  }\n}\n\nconst activityComponents = [\n  'components/LessonChunkActivity.tsx',\n  'components/FlashcardActivity.tsx',\n  'components/QuizActivity.tsx',\n  'components/TimelineActivity.tsx',\n  'components/CardSortActivity.tsx',\n  'components/JudgementRankingActivity.tsx',\n  'components/AO3InterpretationActivity.tsx',\n  'components/PeelResponseActivity.tsx',\n  'components/ConfidenceExitTicketActivity.tsx',\n  'components/LessonContentActivity.tsx',\n];\nfor (const file of activityComponents) {\n  forbidText(file, '/api/student-responses/', `${file} must not call retired demo response endpoints.`);\n}\n\nforbidText('app/api/guided-study/route.ts', "from('guided_study_assignments')", 'Assignment publishing must not fall back to the prototype guided_study_assignments table.');\n\nconst migration = 'supabase/migrations/20260904113000_lock_down_legacy_demo_surface.sql';\nif (!exists(migration)) {\n  failures.push('Legacy-surface lockdown migration is missing.');\n} else {\n  requireText(migration, 'revoke select, insert, update, delete on public.student_responses', 'Legacy response table must be revoked from browser roles.');\n  requireText(migration, 'revoke execute on function %I.%I(%s) from public, anon', 'SECURITY DEFINER functions must lose PUBLIC/anon execute access.');\n}\n\nconst loginForm = 'app/login/LoginForm.tsx';\nrequireText(loginForm, 'safeLocalPath', 'Login redirects must be sanitised to a local path.');\nrequireText(loginForm, 'if (data.session)', 'Student signup must handle confirmation-off sessions without asking for email confirmation.');\nforbidText(loginForm, 'body: JSON.stringify({ email, password, fullName, staffCode, callbackUrl })', 'Staff signup must not trust a client-supplied callback URL.');\n\nconst staffSignup = 'app/api/auth/staff-signup/route.ts';\nrequireText(staffSignup, 'consume_staff_signup_rate_limit', 'Staff signup must remain rate limited.');\nrequireText(staffSignup, 'timingSafeEqual', 'Staff invite codes must use constant-time comparison.');\nrequireText(staffSignup, 'safeLocalPath', 'Staff signup redirects must remain local-only.');\n\nconst rateLimitMigration = 'supabase/migrations/20260904133000_add_staff_signup_rate_limit.sql';\nif (!exists(rateLimitMigration)) {\n  failures.push('Staff-signup rate-limit migration is missing.');\n} else {\n  requireText(rateLimitMigration, 'revoke execute on function public.consume_staff_signup_rate_limit', 'Staff signup rate limiter must not be browser-callable.');\n  requireText(rateLimitMigration, 'to service_role', 'Staff signup rate limiter must be service-role only.');\n}\n\nconst assignmentForm = 'components/GuidedStudyAssignmentForm.tsx';\nrequireText(assignmentForm, "useState(initialClass?.id ?? '')", 'Generic Set Work must not silently preselect the newest class.');\nrequireText(assignmentForm, "useState(initialTopic?.pathwaySlug ?? '')", 'Generic Set Work must not silently preselect a topic.');\nrequireText(assignmentForm, 'disabled={!canConfigure}', 'Assignment configuration must stay locked until class and topic are chosen.');\nforbidText(assignmentForm, '?? classOptions[0]', 'Assignment builder must not restore a silent first-class fallback.');\n\nconst proxy = 'lib/supabase/proxy.ts';\nrequireText(proxy, 'if (!isProtected && !isLogin)', 'Public routes must bypass unnecessary Supabase auth refreshes.');\nrequireText(proxy, 'hasSupabaseAuthCookie', 'Auth middleware must avoid user lookups when there is no Supabase auth cookie.');\nrequireText(proxy, 'clearSupabaseAuthCookies', 'Stale Supabase sessions must clear invalid auth cookies.');\nrequireText(proxy, 'isStaleSessionError', 'Stale-session handling must remain limited to auth-session errors.');\n\nconst schoolTime = 'lib/dateTime.ts';\nrequireText(schoolTime, "SCHOOL_TIME_ZONE = 'Europe/London'", 'School-facing dates must remain pinned to Europe/London.');\n\nif (!exists('package-lock.json')) failures.push('A committed package-lock.json is required for reproducible production installs.');\n\nif (failures.length) {\n  console.error('Production security check failed:\\n- ' + failures.join('\\n- '));\n  process.exit(1);\n}\n\nconsole.log('Production security checks passed.');\n`);

console.log('Production hardening transformations applied.');

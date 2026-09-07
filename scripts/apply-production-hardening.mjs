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
  write(file, `${source.slice(0, elseStart)}      }${source.slice(endStart + closingLength)}`);
}

function legacyRedirect(target) {
  return [
    "import { redirect } from 'next/navigation';",
    '',
    'type Props = {',
    '  searchParams: Promise<{ assignment?: string | string[] }>;',
    '};',
    '',
    'export default async function LegacyWeek1Redirect({ searchParams }: Props) {',
    '  const { assignment } = await searchParams;',
    '  const assignmentId = Array.isArray(assignment) ? assignment[0] : assignment;',
    "  const query = assignmentId ? `?assignment=${encodeURIComponent(assignmentId)}` : '';",
    `  redirect(\`${target}\${query}\`);`,
    '}',
    '',
  ].join('\n');
}

const retiredApi = [
  "import { NextResponse } from 'next/server';",
  '',
  'export async function POST() {',
  '  return NextResponse.json(',
  "    { error: 'This legacy self-study save endpoint has been retired. Refresh the page to use the current practice mode.' },",
  '    { status: 410 },',
  '  );',
  '}',
  '',
].join('\n');

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
  `    try {\n      const position = { least_secure_area: leastSecureArea, understand_better: understandBetter.trim(), need_help_with: needHelpWith.trim(), prompt };\n      if (assignmentId) {\n        const response = await fetch('/api/assignment-progress', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ assignmentId, activityType: 'confidence_exit_ticket', status: 'complete', confidence, position }),\n        });\n        const result = await response.json().catch(() => null);\n        if (!response.ok) throw new Error(result?.error ?? 'Confidence exit ticket could not be saved.');\n      }\n      setSubmitted(true);\n      setSaveStatus('saved');\n      setSaveMessage(assignmentId ? 'Saved. Your teacher can view this confidence check.' : 'Practice confidence check complete for this session.');\n`,
);
replaceRequired(
  'components/ConfidenceExitTicketActivity.tsx',
  '<p>Finish the pathway by telling your teacher how secure you feel and what still needs support.</p>',
  "<p>{assignmentId ? 'Finish the pathway by telling your teacher how secure you feel and what still needs support.' : 'Finish the pathway by reflecting on how secure you feel and what still needs support.'}</p>",
);

write('lib/supabase/proxy.ts', read('scripts/templates/proxy.ts.txt'));
write('scripts/check-production-security.mjs', read('scripts/templates/check-production-security.mjs.txt'));

console.log('Production hardening transformations applied.');

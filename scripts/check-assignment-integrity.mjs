import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const lessonRoot = join(root, 'app/student/lesson');

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

function fail(message) {
  console.error(`Assignment integrity check failed: ${message}`);
  process.exitCode = 1;
}

function assertContains(path, marker, message) {
  if (!read(path).includes(marker)) fail(message ?? `${path} is missing required marker: ${marker}`);
}

function assertNotContains(path, marker, message) {
  if (read(path).includes(marker)) fail(message ?? `${path} contains forbidden marker: ${marker}`);
}

function sourceFilesUnder(directory) {
  if (!existsSync(directory)) return [];
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...sourceFilesUnder(absolute));
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(absolute);
  }
  return files;
}

const componentFiles = readdirSync(join(root, 'components'))
  .filter((name) => name.endsWith('.tsx'));

for (const file of componentFiles) {
  const source = read(`components/${file}`);
  if (/nextHref\s*=\s*['"]\/student\/lesson\/1905\//.test(source)) {
    fail(`${file} contains a hard-coded 1905 next route.`);
  }
}

const bridge = read('components/AssignmentActivityProgressBridge.tsx');
if (bridge.includes('onClickCapture') || bridge.includes('isCompletionControl')) {
  fail('AssignmentActivityProgressBridge must not infer completion from button clicks.');
}
assertContains('components/AssignmentActivityProgressBridge.tsx', "searchParams.get('assignment')", 'Assignment progress bridge must use the exact assignment ID from the route.');
assertContains('components/AssignmentActivityProgressBridge.tsx', 'saveAssignmentActivityProgress', 'Assignment progress bridge must write through the authenticated assignment progress client.');

for (const file of [
  'FlashcardActivity.tsx',
  'TimelineActivity.tsx',
  'CardSortActivity.tsx',
  'JudgementRankingActivity.tsx',
  'AO3InterpretationActivity.tsx',
  'QuizActivity.tsx',
  'PeelResponseActivity.tsx',
  'ConfidenceExitTicketActivity.tsx',
  'LessonContentActivity.tsx',
]) {
  const source = read(`components/${file}`);
  if (!source.includes("searchParams.get('assignment')")) {
    fail(`${file} does not distinguish authenticated assignment work from independent self-study.`);
  }
  if (!source.includes('saveAssignmentActivityProgress') && !source.includes('/api/assignment-progress')) {
    fail(`${file} is not wired to authenticated assignment progress.`);
  }
}

const renderer = read('components/GenericActivityRenderer.tsx');
for (const marker of ["searchParams.get('assignment')", 'withAssignment', 'AssignmentActivityProgressBridge']) {
  if (!renderer.includes(marker)) fail(`GenericActivityRenderer is missing assignment-context handling: ${marker}.`);
}

const resolver = read('lib/pathwayResolver.ts');
if (!resolver.includes('requiredActivityTypes.length > 0') || !resolver.includes('routeTypes')) {
  fail('Assigned pathway resolution no longer appears to be restricted to required activity types.');
}

const progressRoute = read('app/api/assignment-progress/route.ts');
if (!progressRoute.includes('new_attempt_input')) {
  fail('Assignment progress API is not forwarding explicit new attempts.');
}

const pathwayRuntimePath = 'components/pathway/ResolvedModularPathwayPage.tsx';
for (const marker of ['x-assignment-id', 'requestedAssignmentId', ".eq('assignment_id', requestedAssignmentId)", ".eq('student_id', user.id)"]) {
  assertContains(pathwayRuntimePath, marker, `Modular pathway runtime is missing exact authenticated assignment validation: ${marker}.`);
}
for (const marker of ['DEMO_STUDENT_ID', 'guided_study_assignments', ".order('assigned_at'"]) {
  assertNotContains(pathwayRuntimePath, marker, `Modular pathway runtime must not fall back to legacy or newest-assignment state: ${marker}.`);
}

const activityRuntimePath = 'components/pathway/ResolvedModularActivityPage.tsx';
for (const marker of ['x-assignment-id', 'requestedAssignmentId', ".eq('assignment_id', requestedAssignmentId)", ".eq('student_id', user.id)"]) {
  assertContains(activityRuntimePath, marker, `Modular activity runtime is missing exact authenticated assignment validation: ${marker}.`);
}
for (const marker of ['DEMO_STUDENT_ID', 'guided_study_assignments']) {
  assertNotContains(activityRuntimePath, marker, `Modular activity runtime restored legacy assignment state: ${marker}.`);
}

for (const file of ['app/student/dashboard/page.tsx', 'app/student/work/page.tsx']) {
  const source = read(file);
  if (!source.includes("rpc('sync_my_assignment_recipients')")) {
    fail(`${file} must repair missing published assignment recipient links before loading work.`);
  }
  if (!source.includes('?assignment=${assignment.id}')) {
    fail(`${file} must launch each classroom assignment with its exact assignment ID.`);
  }
}

const modularRoots = readdirSync(lessonRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((routeName) => {
    const rootPage = join(lessonRoot, routeName, 'page.tsx');
    return existsSync(rootPage) && readFileSync(rootPage, 'utf8').includes('ModularPathwayPage');
  });

if (modularRoots.length === 0) {
  fail('No modular student pathways were discovered; assignment route audit cannot run.');
}

const forbiddenRouteMarkers = ['DEMO_STUDENT_ID', 'guided_study_assignments', 'student_responses'];

for (const routeName of modularRoots) {
  const routeDirectory = join(lessonRoot, routeName);
  const dynamicActivityPage = join(routeDirectory, '[activity]', 'page.tsx');

  if (!existsSync(dynamicActivityPage)) {
    fail(`${routeName} is assignable through the modular pathway runtime but has no [activity] route.`);
  } else if (!readFileSync(dynamicActivityPage, 'utf8').includes('ModularActivityPage')) {
    fail(`${routeName}/[activity] does not use the authenticated modular activity runtime.`);
  }

  for (const entry of readdirSync(routeDirectory, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === '[activity]') continue;
    const shadowPage = join(routeDirectory, entry.name, 'page.tsx');
    if (existsSync(shadowPage)) {
      fail(`${routeName}/${entry.name} has a static activity page that shadows [activity] and can lose exact assignment context.`);
    }
  }

  for (const absoluteFile of sourceFilesUnder(routeDirectory)) {
    const source = readFileSync(absoluteFile, 'utf8');
    for (const marker of forbiddenRouteMarkers) {
      if (source.includes(marker)) {
        fail(`${relative(root, absoluteFile)} contains legacy assignment marker ${marker}.`);
      }
    }
  }
}

if (!process.exitCode) {
  console.log(`Assignment integrity checks passed across ${modularRoots.length} modular pathways.`);
}

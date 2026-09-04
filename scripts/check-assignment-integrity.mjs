import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

function fail(message) {
  console.error(`Assignment integrity check failed: ${message}`);
  process.exitCode = 1;
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

for (const file of [
  'FlashcardActivity.tsx',
  'TimelineActivity.tsx',
  'CardSortActivity.tsx',
  'JudgementRankingActivity.tsx',
  'AO3InterpretationActivity.tsx',
]) {
  const source = read(`components/${file}`);
  if (!source.includes('saveAssignmentActivityProgress')) {
    fail(`${file} is not wired to authenticated assignment progress.`);
  }
}

const resolver = read('lib/pathwayResolver.ts');
if (!resolver.includes('requiredActivityTypes.length > 0') || !resolver.includes('routeTypes')) {
  fail('Assigned pathway resolution no longer appears to be restricted to required activity types.');
}

const progressRoute = read('app/api/assignment-progress/route.ts');
if (!progressRoute.includes('new_attempt_input')) {
  fail('Assignment progress API is not forwarding explicit new attempts.');
}

if (!process.exitCode) {
  console.log('Assignment integrity checks passed.');
}

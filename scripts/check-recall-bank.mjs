import fs from 'node:fs';

const source = fs.readFileSync(new URL('../lib/recall/questions.ts', import.meta.url), 'utf8');
const ids = [...source.matchAll(/id:\s*'([^']+)'/g)].map((match) => match[1]).filter((id) => !['alexander-ii','alexander-iii','nicholas-ii','lenin','stalin','khrushchev'].includes(id));
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length) {
  console.error(`Duplicate recall question IDs: ${[...new Set(duplicateIds)].join(', ')}`);
  process.exit(1);
}

const mcqBlocks = source.match(/type: 'mcq',[\s\S]*?(?=\n\s*},\n|$)/g) ?? [];
for (const block of mcqBlocks) {
  const options = block.match(/options:\s*\[([^\]]+)\]/)?.[1];
  if (!options) {
    console.error('An MCQ is missing options.');
    process.exit(1);
  }
  const optionCount = [...options.matchAll(/'[^']*'/g)].length;
  if (optionCount !== 4) {
    console.error(`An MCQ has ${optionCount} options instead of 4.`);
    process.exit(1);
  }
}

const topicQuestionCounts = new Map();
for (const match of source.matchAll(/id:\s*'([^']+)'\s*,\s*topicId:\s*'([^']+)'\s*,\s*type:/g)) {
  topicQuestionCounts.set(match[2], (topicQuestionCounts.get(match[2]) ?? 0) + 1);
}
for (const topic of ['alexander-ii','alexander-iii','nicholas-ii','lenin','stalin','khrushchev']) {
  if ((topicQuestionCounts.get(topic) ?? 0) < 5) {
    console.error(`Recall topic ${topic} has fewer than five questions.`);
    process.exit(1);
  }
}

console.log(`Recall bank check passed: ${ids.length} questions across ${topicQuestionCounts.size} topics.`);

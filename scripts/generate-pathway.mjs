#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, '').split('=');
  return [key, rest.join('=')];
}));

const slug = args.slug;
const title = args.title;
const lessonTitle = args['lesson-title'] || title;
const subtitle = args.subtitle || 'Add pathway subtitle';
const yearGroup = args.year || 'Y12';
const courseWeek = Number(args.week || 1);
const unitNumber = Number(args.unit || 1);
const unitTitle = args['unit-title'] || 'Add unit title';

function fail(message) {
  console.error(`\nPathway generator error: ${message}\n`);
  process.exit(1);
}

if (!slug || !title) fail('Use --slug=... and --title=...');
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail('Slug must use lowercase kebab-case.');
if (!Number.isInteger(courseWeek) || courseWeek < 1) fail('Week must be a positive integer.');
if (!Number.isInteger(unitNumber) || unitNumber < 1) fail('Unit must be a positive integer.');

const root = process.cwd();
const pascal = slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
const camel = pascal.charAt(0).toLowerCase() + pascal.slice(1);
const contentPath = path.join(root, 'lib', `pathway${pascal}Content.ts`);
const routeDir = path.join(root, 'app', 'student', 'lesson', slug);
const pagePath = path.join(routeDir, 'page.tsx');
const activityPath = path.join(routeDir, '[activity]', 'page.tsx');

for (const filePath of [contentPath, pagePath, activityPath]) {
  if (fs.existsSync(filePath)) fail(`Refusing to overwrite existing file: ${path.relative(root, filePath)}`);
}

const contentFile = `export const ${camel}PathwaySlug = '${slug}';

export const ${camel}LessonSections = [
  {
    heading: 'The enquiry',
    body: 'Replace with a concise A-Level explanation of the enquiry.',
    question: 'Replace with a focused check-for-understanding question.',
    taskType: 'explain'
  }
];

export const ${camel}Timeline = {
  events: [
    { id: 'event-1', date: 'DATE', title: 'Event title', detail: 'Explain why this event mattered.' }
  ]
};

export const ${camel}Flashcards = [
  { id: 'card-1', front: 'Key term', back: 'Precise A-Level definition.' }
];

export const ${camel}Quiz = [
  {
    id: 'question-1',
    question: 'Add a precise multiple-choice question.',
    options: ['Plausible option A', 'Plausible option B', 'Plausible option C', 'Plausible option D'],
    correct: 'Plausible option A'
  }
];

export const ${camel}Judgement = {
  question: 'Rank the factors. Which mattered most?',
  factors: [
    { id: 'factor-1', title: 'Factor title', detail: 'Explain why this factor mattered.' }
  ]
};

export const ${camel}AO3 = {
  question: 'Which interpretation is most convincing?',
  interpretations: [
    { historian: 'View A', argument: 'Add a concise, plausible interpretation.' }
  ]
};

export const ${camel}Peel = {
  question: 'Add a focused explain or assess question.',
  stretchQuestion: 'Add a higher-demand version.',
  scaffold: ['Point', 'Evidence', 'Explain', 'Link', 'Judgement']
};

export const ${camel}Confidence = {
  prompt: 'How confident are you explaining this topic?',
  leastSecureOptions: ['Area 1', 'Area 2', 'Area 3'],
  scale: [1, 2, 3, 4, 5]
};

export const ${camel}Fallbacks: Record<string, any> = {
  lesson_content: { sections: ${camel}LessonSections },
  timeline: ${camel}Timeline,
  flashcards: { cards: ${camel}Flashcards },
  quiz: { questions: ${camel}Quiz },
  judgement_ranking: ${camel}Judgement,
  ao3_interpretation: ${camel}AO3,
  peel_response: ${camel}Peel,
  confidence_exit_ticket: ${camel}Confidence,
};
`;

const pageFile = `import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { ${camel}PathwaySlug, ${camel}Fallbacks } from '@/lib/pathway${pascal}Content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ${pascal}PathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={${camel}PathwaySlug}
      fallbackInstructions="Complete one task at a time and use precise contextual knowledge."
      fallbackContentByActivityType={${camel}Fallbacks}
    />
  );
}
`;

const activityFile = `import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import { ${camel}PathwaySlug, ${camel}Fallbacks } from '@/lib/pathway${pascal}Content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ${pascal}ActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;
  return (
    <ModularActivityPage
      pathwaySlug={${camel}PathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={${camel}Fallbacks}
    />
  );
}
`;

fs.mkdirSync(path.dirname(contentPath), { recursive: true });
fs.mkdirSync(path.dirname(pagePath), { recursive: true });
fs.mkdirSync(path.dirname(activityPath), { recursive: true });
fs.writeFileSync(contentPath, contentFile);
fs.writeFileSync(pagePath, pageFile);
fs.writeFileSync(activityPath, activityFile);

const registrySnippet = `  '${slug}': {
    pathwaySlug: '${slug}',
    title: '${title.replaceAll("'", "\\'")}',
    lessonTitle: '${lessonTitle.replaceAll("'", "\\'")}',
    subtitle: '${subtitle.replaceAll("'", "\\'")}',
    yearGroup: '${yearGroup}',
    courseWeek: ${courseWeek},
    unitNumber: ${unitNumber},
    unitTitle: '${unitTitle.replaceAll("'", "\\'")}',
    mainFocus: '${subtitle.replaceAll("'", "\\'")}',
    writtenFocus: 'Add written focus',
    writtenFocusType: 'AO1_PEEL',
    breadthLenses: ['governance'],
    status: 'planned',
    routeBase: '/student/lesson/${slug}',
  },`;

console.log('\nCreated:');
console.log(`- ${path.relative(root, contentPath)}`);
console.log(`- ${path.relative(root, pagePath)}`);
console.log(`- ${path.relative(root, activityPath)}`);
console.log('\nAdd this entry to lib/pathwayRegistry.ts after academic review:\n');
console.log(registrySnippet);
console.log('\nThe generator never overwrites existing files and leaves new pathways as planned.\n');

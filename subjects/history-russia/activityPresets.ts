import type { StudyMode, SubjectActivityOption, SubjectActivityPreset } from '@/subjects/types';

export const russiaActivityOptions: SubjectActivityOption[] = [
  { activityType: 'lesson_content', label: 'Lesson notes', description: 'Core explanation and context.', estimatedMinutes: 10 },
  { activityType: 'timeline', label: 'Timeline', description: 'Chronology and turning points.', estimatedMinutes: 7 },
  { activityType: 'flashcards', label: 'Flashcards', description: 'Key people, terms and concepts.', estimatedMinutes: 7 },
  { activityType: 'quiz', label: 'Retrieval quiz', description: 'Trackable knowledge check.', estimatedMinutes: 8 },
  { activityType: 'judgement_ranking', label: 'Judgement ranking', description: 'Relative importance and significance.', estimatedMinutes: 7 },
  { activityType: 'ao3_interpretation', label: 'AO3 interpretation', description: 'Evaluate a historical interpretation.', estimatedMinutes: 12 },
  { activityType: 'peel_response', label: 'PEEL response', description: 'Produce written exam evidence.', estimatedMinutes: 15 },
  { activityType: 'confidence_exit_ticket', label: 'Confidence check', description: 'Final reflection and self-report.', estimatedMinutes: 3 },
];

const fullRoute = russiaActivityOptions.map((item) => item.activityType);

export const russiaActivityPresets: SubjectActivityPreset[] = [
  { id: 'full_guided_study', title: 'Full study', description: 'Complete independent pathway.', activities: fullRoute },
  { id: 'exam_practice', title: 'Exam practice', description: 'Retrieval and written evidence.', activities: ['quiz', 'ao3_interpretation', 'peel_response', 'confidence_exit_ticket'] },
  { id: 'recap', title: 'Recap', description: 'Repair knowledge efficiently.', activities: ['lesson_content', 'flashcards', 'quiz', 'confidence_exit_ticket'] },
  { id: 'confidence_repair', title: 'Confidence repair', description: 'Rebuild understanding carefully.', activities: fullRoute },
];

export function getRussiaDefaultInstructions(mode: StudyMode, title: string) {
  if (mode === 'exam_practice') return `Complete the retrieval and AO3 tasks, then produce a focused PEEL paragraph on ${title}. Finish with the confidence check.`;
  if (mode === 'recap') return `Use the lesson notes, flashcards and quiz to repair weak knowledge on ${title}. Complete the confidence check last.`;
  if (mode === 'confidence_repair') return `Move carefully through the ${title} pathway and identify what still feels insecure in the confidence check.`;
  return `Complete the full ${title} guided study pathway in order. Build knowledge before moving to judgement, interpretation and written argument.`;
}

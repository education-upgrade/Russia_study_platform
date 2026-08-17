import type { StudyMode, SubjectActivityOption, SubjectActivityPreset } from '@/subjects/types';

export const psychologyAqaActivityOptions: SubjectActivityOption[] = [
  { activityType: 'lesson_content', label: 'Lesson notes', description: 'Core explanation and psychological concepts.', estimatedMinutes: 10 },
  { activityType: 'flashcards', label: 'Key terms', description: 'Definitions, studies and core concepts.', estimatedMinutes: 7 },
  { activityType: 'quiz', label: 'Retrieval quiz', description: 'Trackable knowledge check.', estimatedMinutes: 8 },
  { activityType: 'card_sort', label: 'Application sort', description: 'Classify examples, evidence or explanations.', estimatedMinutes: 7 },
  { activityType: 'judgement_ranking', label: 'Evaluation ranking', description: 'Rank strengths, limitations or explanations.', estimatedMinutes: 8 },
  { activityType: 'peel_response', label: 'Evaluation response', description: 'Produce a structured written response.', estimatedMinutes: 15 },
  { activityType: 'confidence_exit_ticket', label: 'Confidence check', description: 'Final reflection and self-report.', estimatedMinutes: 3 },
];

const fullRoute = ['lesson_content', 'flashcards', 'quiz', 'card_sort', 'judgement_ranking', 'peel_response', 'confidence_exit_ticket'];

export const psychologyAqaActivityPresets: SubjectActivityPreset[] = [
  { id: 'full_guided_study', title: 'Full study', description: 'Complete the full independent pathway.', activities: fullRoute },
  { id: 'exam_practice', title: 'Exam practice', description: 'Retrieval, application and written evaluation.', activities: ['quiz', 'card_sort', 'judgement_ranking', 'peel_response', 'confidence_exit_ticket'] },
  { id: 'recap', title: 'Recap', description: 'Repair core knowledge efficiently.', activities: ['lesson_content', 'flashcards', 'quiz', 'confidence_exit_ticket'] },
  { id: 'confidence_repair', title: 'Confidence repair', description: 'Rebuild understanding carefully.', activities: fullRoute },
];

export function getPsychologyDefaultInstructions(mode: StudyMode, title: string) {
  if (mode === 'exam_practice') return `Complete the retrieval and application tasks on ${title}, then produce the written evaluation and finish with the confidence check.`;
  if (mode === 'recap') return `Use the notes, key terms and retrieval quiz to repair weak knowledge on ${title}. Complete the confidence check last.`;
  if (mode === 'confidence_repair') return `Move carefully through the ${title} pathway and identify what still feels insecure in the confidence check.`;
  return `Complete the full ${title} guided study pathway in order. Secure knowledge before moving to application, evaluation and written response.`;
}

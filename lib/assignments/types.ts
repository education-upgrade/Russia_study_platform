export const assignmentModes = [
  'full_guided_study',
  'exam_practice',
  'recap',
  'confidence_repair',
] as const;

export type AssignmentMode = (typeof assignmentModes)[number];

export const assignmentStatuses = ['draft', 'published', 'archived'] as const;
export type AssignmentStatus = (typeof assignmentStatuses)[number];

export type ClassroomAssignment = {
  id: string;
  class_id: string;
  teacher_id: string;
  title: string;
  pathway_slug: string;
  lesson_title: string;
  mode: AssignmentMode;
  required_activity_types: string[];
  instructions: string | null;
  due_at: string | null;
  status: AssignmentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AssignmentRecipient = {
  assignment_id: string;
  student_id: string;
  assigned_at: string;
  status: 'assigned' | 'removed';
};

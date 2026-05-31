import { supabase } from './supabase';
import { getPathwayConfig } from './pathwayRegistry';

const STUDENT_ID = '22222222-2222-2222-2222-222222222222';

const TYPES = [
  'confidence_exit_ticket',
  'ao3_interpretation',
  'judgement_ranking',
  'peel_response',
  'lesson_content',
  'card_sort',
  'timeline',
  'flashcards',
  'quiz',
];

function parse(activityId: string) {
  if (!activityId.startsWith('virtual-')) return null;
  const value = activityId.replace(/^virtual-/, '');
  const activityType = TYPES.find((type) => value.endsWith(`-${type}`));
  if (!activityType) return null;
  return { pathwaySlug: value.slice(0, -(activityType.length + 1)), activityType };
}

function titleFromRegistry(pathwaySlug: string) {
  try {
    return getPathwayConfig(pathwaySlug).lessonTitle;
  } catch {
    return null;
  }
}

export async function resolveVirtualActivityId(activityId: string) {
  if (!supabase || !activityId.startsWith('virtual-')) return activityId;

  const parsed = parse(activityId);
  if (!parsed) return activityId;

  const { data: assignment } = await supabase
    .from('guided_study_assignments')
    .select('lesson_title')
    .eq('assigned_student_id', STUDENT_ID)
    .eq('status', 'active')
    .eq('pathway_slug', parsed.pathwaySlug)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<{ lesson_title: string | null }>();

  const lessonTitle = assignment?.lesson_title ?? titleFromRegistry(parsed.pathwaySlug);
  if (!lessonTitle) return activityId;

  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, unit_id')
    .eq('title', lessonTitle)
    .limit(1)
    .maybeSingle<{ id: string; unit_id: string | null }>();

  if (!lesson?.id) return activityId;

  const { data: existing } = await supabase
    .from('activities')
    .select('id')
    .eq('lesson_id', lesson.id)
    .eq('activity_type', parsed.activityType)
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (existing?.id) return existing.id;

  const { data: created } = await supabase
    .from('activities')
    .insert({
      unit_id: lesson.unit_id,
      lesson_id: lesson.id,
      activity_type: parsed.activityType,
      title: parsed.activityType.replaceAll('_', ' '),
      skill_focus: 'Guided study evidence',
      difficulty: 'secure',
      estimated_minutes: 10,
      content_json: {},
    })
    .select('id')
    .limit(1)
    .maybeSingle<{ id: string }>();

  return created?.id ?? activityId;
}

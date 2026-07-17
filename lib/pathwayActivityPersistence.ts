import { createHash } from 'crypto';
import { supabase } from '@/lib/supabase';
import type { ResolvedPathwayActivity } from '@/lib/pathwayResolver';

function stableUuid(value: string) {
  const hex = createHash('sha256').update(value).digest('hex').slice(0, 32).split('');
  hex[12] = '4';
  const variant = Number.parseInt(hex[16], 16);
  hex[16] = ((variant & 0x3) | 0x8).toString(16);
  const joined = hex.join('');
  return `${joined.slice(0, 8)}-${joined.slice(8, 12)}-${joined.slice(12, 16)}-${joined.slice(16, 20)}-${joined.slice(20)}`;
}

export function getPathwayActivityPersistenceId(pathwaySlug: string, activityType: string) {
  return stableUuid(`pathway:${pathwaySlug}:activity:${activityType}`);
}

export async function materialisePathwayActivities(
  pathwaySlug: string,
  activities: ResolvedPathwayActivity[]
) {
  if (!supabase) return activities;

  const materialised = activities.map((activity) => ({
    ...activity,
    id: activity.isVirtual
      ? getPathwayActivityPersistenceId(pathwaySlug, activity.activity_type)
      : activity.id,
  }));

  const virtualRows = materialised
    .filter((activity) => activity.isVirtual)
    .map((activity) => ({
      id: activity.id,
      activity_type: activity.activity_type,
      title: activity.title,
      content_json: activity.content_json ?? activity.fallbackContent ?? {},
    }));

  if (virtualRows.length > 0) {
    const { error } = await supabase.from('activities').upsert(virtualRows, { onConflict: 'id' });
    if (error) throw new Error(`Could not prepare pathway progress records: ${error.message}`);
  }

  return materialised.map((activity) => ({ ...activity, isVirtual: false }));
}

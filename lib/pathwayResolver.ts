import { getActivityLabel, getActivityRouteSlug, orderSupportedActivityTypes } from './activityTypeRegistry';

export type SeededPathwayActivity = {
  id: string;
  activity_type: string;
  title: string;
  content_json?: any;
};

export type ResolvedPathwayActivity = SeededPathwayActivity & {
  routeSlug: string;
  label: string;
  isVirtual: boolean;
  fallbackContent?: any;
};

type ResolvePathwayActivitiesArgs = {
  pathwaySlug: string;
  seededActivities: SeededPathwayActivity[];
  requiredActivityTypes?: string[];
  fallbackContentByActivityType?: Record<string, any>;
};

function getFallbackTitle(activityType: string) {
  return getActivityLabel(activityType);
}

function makeVirtualActivity(
  pathwaySlug: string,
  activityType: string,
  fallbackContentByActivityType: Record<string, any>
): ResolvedPathwayActivity {
  return {
    id: `virtual-${pathwaySlug}-${activityType}`,
    activity_type: activityType,
    title: getFallbackTitle(activityType),
    content_json: fallbackContentByActivityType[activityType] ?? {},
    routeSlug: getActivityRouteSlug(activityType),
    label: getActivityLabel(activityType),
    isVirtual: true,
    fallbackContent: fallbackContentByActivityType[activityType],
  };
}

export function resolvePathwayActivities({
  pathwaySlug,
  seededActivities,
  requiredActivityTypes = [],
  fallbackContentByActivityType = {},
}: ResolvePathwayActivitiesArgs) {
  const seededTypes = seededActivities.map((activity) => activity.activity_type);
  const fallbackTypes = Object.keys(fallbackContentByActivityType);
  const requestedTypes = requiredActivityTypes.length > 0 ? requiredActivityTypes : seededTypes;
  const allTypes = orderSupportedActivityTypes(Array.from(new Set([...requestedTypes, ...seededTypes, ...fallbackTypes])));

  return allTypes.map((activityType) => {
    const seededActivity = seededActivities.find((activity) => activity.activity_type === activityType);

    if (seededActivity) {
      return {
        ...seededActivity,
        routeSlug: getActivityRouteSlug(activityType),
        label: getActivityLabel(activityType),
        isVirtual: false,
        fallbackContent: fallbackContentByActivityType[activityType],
      } satisfies ResolvedPathwayActivity;
    }

    return makeVirtualActivity(pathwaySlug, activityType, fallbackContentByActivityType);
  });
}

export function findActivityByRouteSlug(activities: ResolvedPathwayActivity[], routeSlug: string) {
  return activities.find((activity) => activity.routeSlug === routeSlug) ?? null;
}

export function getNextActivityHref(routeBase: string, activities: ResolvedPathwayActivity[], currentActivityType: string) {
  const trackableActivities = activities.filter((activity) => activity.activity_type !== 'lesson_content');
  const currentIndex = trackableActivities.findIndex((activity) => activity.activity_type === currentActivityType);
  const nextActivity = currentIndex === -1 ? null : trackableActivities[currentIndex + 1];
  return nextActivity ? `${routeBase}/${nextActivity.routeSlug}` : undefined;
}

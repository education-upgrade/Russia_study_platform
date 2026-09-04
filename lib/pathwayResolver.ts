import { getActivityRouteSlug, orderSupportedActivityTypes } from './activityTypeRegistry';
import { getSubjectActivityLabel } from './activeSubjectRuntime';

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

function getFallbackTitle(pathwaySlug: string, activityType: string) {
  return getSubjectActivityLabel(pathwaySlug, activityType);
}

function isEmptyContent(content: any) {
  if (!content) return true;
  if (Array.isArray(content)) return content.length === 0;
  if (typeof content !== 'object') return false;
  return Object.keys(content).length === 0;
}

function getContentOrFallback(activityType: string, seededContent: any, fallbackContentByActivityType: Record<string, any>) {
  const fallbackContent = fallbackContentByActivityType[activityType];
  return isEmptyContent(seededContent) && fallbackContent ? fallbackContent : seededContent;
}

function makeVirtualActivity(
  pathwaySlug: string,
  activityType: string,
  fallbackContentByActivityType: Record<string, any>
): ResolvedPathwayActivity {
  return {
    id: `virtual-${pathwaySlug}-${activityType}`,
    activity_type: activityType,
    title: getFallbackTitle(pathwaySlug, activityType),
    content_json: fallbackContentByActivityType[activityType] ?? {},
    routeSlug: getActivityRouteSlug(activityType),
    label: getSubjectActivityLabel(pathwaySlug, activityType),
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
  const availableTypes = Array.from(new Set([...seededTypes, ...fallbackTypes]));
  const routeTypes = requiredActivityTypes.length > 0
    ? Array.from(new Set(requiredActivityTypes))
    : availableTypes;
  const allTypes = orderSupportedActivityTypes(routeTypes);

  return allTypes.map((activityType) => {
    const seededActivity = seededActivities.find((activity) => activity.activity_type === activityType);

    if (seededActivity) {
      return {
        ...seededActivity,
        content_json: getContentOrFallback(activityType, seededActivity.content_json, fallbackContentByActivityType),
        routeSlug: getActivityRouteSlug(activityType),
        label: getSubjectActivityLabel(pathwaySlug, activityType),
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
  const currentIndex = activities.findIndex((activity) => activity.activity_type === currentActivityType);
  const nextActivity = currentIndex === -1 ? null : activities[currentIndex + 1];
  return nextActivity ? `${routeBase}/${nextActivity.routeSlug}` : undefined;
}

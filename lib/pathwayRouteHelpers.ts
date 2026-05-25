import {
  getActivityLabel,
  getActivityRouteSlug,
  getNextActivityType,
  isEvidenceActivity,
  isTrackableActivity,
  orderSupportedActivityTypes,
  validatePathwayActivityMix,
} from './activityTypeRegistry';

export function getRegistryBackedActivityRoute(routeBase: string, activityType: string) {
  const routeSlug = getActivityRouteSlug(activityType);
  return `${routeBase}/${routeSlug}`;
}

export function orderRegistryBackedActivityTypes(activityTypes: string[]) {
  return orderSupportedActivityTypes(activityTypes);
}

export function getRegistryBackedNextActivityRoute(
  routeBase: string,
  activityTypes: string[],
  currentActivityType: string
) {
  const nextActivityType = getNextActivityType(activityTypes, currentActivityType);
  if (!nextActivityType) return routeBase;
  return getRegistryBackedActivityRoute(routeBase, nextActivityType);
}

export function getRegistryBackedActivityLabel(activityType: string) {
  return getActivityLabel(activityType);
}

export function isRegistryBackedTrackableActivity(activityType: string) {
  return isTrackableActivity(activityType);
}

export function isRegistryBackedEvidenceActivity(activityType: string) {
  return isEvidenceActivity(activityType);
}

export function validateRegistryBackedPathwayActivityMix(activityTypes: string[]) {
  return validatePathwayActivityMix(activityTypes);
}

// Compatibility aliases for new pathway pages.
// Existing pathwayRegistry helpers remain untouched until each working route has been migrated safely.
export const getActivityRoute = getRegistryBackedActivityRoute;
export const orderActivityTypes = orderRegistryBackedActivityTypes;
export const getActivityLabelForRoute = getRegistryBackedActivityLabel;

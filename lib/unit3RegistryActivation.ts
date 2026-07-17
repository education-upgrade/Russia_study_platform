import { pathwayRegistry } from '@/lib/pathwayRegistry';

const unit3PathwaySlugs = [
  'industry-before-1894',
  'agriculture-land-hunger',
  'social-divisions',
  'orthodoxy-culture-authority',
  'tsarism-secure-1894',
] as const;

for (const pathwaySlug of unit3PathwaySlugs) {
  const pathway = pathwayRegistry[pathwaySlug];
  if (pathway) pathway.status = 'ready';
}

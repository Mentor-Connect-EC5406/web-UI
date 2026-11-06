// features built ahead of their backend endpoints, see docs/API_HANDOFF.md "Waiting on the backend"
// turn them on locally with VITE_FEATURES=mentorships,sessionTasks in .env.local
export const FEATURE_NAMES = ['mentorships', 'sessionTasks', 'mentorReschedule', 'meetingLinkEdit'] as const;

export type Feature = (typeof FEATURE_NAMES)[number];

export function parseFeatures(value: string | undefined): ReadonlySet<Feature> {
  const names = (value ?? '').split(',').map((name) => name.trim());
  return new Set(FEATURE_NAMES.filter((feature) => names.includes(feature)));
}

const enabled = parseFeatures(import.meta.env.VITE_FEATURES);

export const isFeatureOn = (feature: Feature) => enabled.has(feature);

export const activityFilters = [
  { id: 'drinks', label: 'Drinks', icon: '◒', tags: ['drinks'] },
  { id: 'dinner', label: 'Dinner', icon: '◐', tags: ['food'] },
  { id: 'outside', label: 'Outside', icon: '◌', tags: ['outdoors'] },
  { id: 'culture', label: 'Culture', icon: '◇', tags: ['culture'] },
  { id: 'party', label: 'Party', icon: '✦', tags: ['lively', 'friends'] },
] as const;

export type ActivityFilterId = (typeof activityFilters)[number]['id'];

export function filterExperiencesByActivity<T extends { tags: readonly string[] }>(
  experiences: T[],
  activity?: ActivityFilterId,
): T[] {
  if (!activity) return experiences;
  const filter = activityFilters.find((candidate) => candidate.id === activity);
  return filter ? experiences.filter((experience) => filter.tags.every((tag) => experience.tags.includes(tag))) : experiences;
}

import { rankExperiences, type RankedExperience } from '../ranking';

const experiences: RankedExperience[] = [
  {
    id: 'public-popular',
    relationship: 'public',
    tags: ['lively', 'drinks'],
    distanceKm: 0.3,
    hoursOld: 2,
    contextualHearts: 12,
  },
  {
    id: 'friend-match',
    relationship: 'friend',
    tags: ['cozy', 'catch-up'],
    distanceKm: 1.1,
    hoursOld: 14,
    contextualHearts: 1,
  },
];

describe('contextual feed ranking seam', () => {
  it('prioritizes a matching friend experience over a popular public one', () => {
    expect(
      rankExperiences(experiences, {
        desiredTags: ['cozy', 'catch-up'],
        currentHour: 18,
      }).map((item) => item.id),
    ).toEqual(['friend-match', 'public-popular']);
  });

  it('uses contextual hearts as one signal rather than the whole ranking', () => {
    const ranked = rankExperiences(experiences, {
      desiredTags: ['drinks'],
      currentHour: 22,
    });

    expect(ranked[0].id).toBe('public-popular');
  });
});

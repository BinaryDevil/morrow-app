import { rankExperiences, rankRecommendations, type RankedExperience } from '../ranking';

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
    id: 'follower-match',
    relationship: 'follower',
    tags: ['cozy', 'catch-up'],
    distanceKm: 1.1,
    hoursOld: 14,
    contextualHearts: 1,
  },
];

describe('contextual feed ranking seam', () => {
  it('prioritizes a matching follower experience over a popular public one', () => {
    expect(
      rankExperiences(experiences, {
        desiredTags: ['cozy', 'catch-up'],
        currentHour: 18,
      }).map((item) => item.id),
    ).toEqual(['follower-match', 'public-popular']);
  });

  it('uses contextual hearts as one signal rather than the whole ranking', () => {
    const ranked = rankExperiences(experiences, {
      desiredTags: ['drinks'],
      currentHour: 22,
    });

    expect(ranked[0].id).toBe('public-popular');
  });

  it('keeps a follower ahead of otherwise comparable local discoveries', () => {
    const comparableExperiences: RankedExperience[] = [
      { ...experiences[0], id: 'public', relationship: 'public', tags: ['cozy'], distanceKm: 1, hoursOld: 4, contextualHearts: 3 },
      { ...experiences[0], id: 'taste-match', relationship: 'taste-match', tags: ['cozy'], distanceKm: 1, hoursOld: 4, contextualHearts: 3 },
      { ...experiences[0], id: 'follower', relationship: 'follower', tags: ['cozy'], distanceKm: 1, hoursOld: 4, contextualHearts: 3 },
    ];

    expect(rankExperiences(comparableExperiences, { desiredTags: ['cozy'], currentHour: 18 }).map(({ id }) => id)).toEqual([
      'follower',
      'taste-match',
      'public',
    ]);
  });

  it('explains each recommendation using the signals that brought it forward', () => {
    const recommendations = rankRecommendations([experiences[1]], {
      desiredTags: ['cozy'],
      intentTags: ['catch-up'],
      currentHour: 18,
    });

    expect(recommendations[0].explanation).toBe('From someone you follow · Fits your catch-up mood · 1.1 km away, shared recently, loved in a similar context');
  });

  it('uses the current part of the day as an immediate intent when none is selected', () => {
    const recommendations = rankRecommendations([
      { ...experiences[0], id: 'drinks', tags: ['drinks'] },
      { ...experiences[0], id: 'coffee', tags: ['coffee'] },
    ], { desiredTags: [], currentHour: 9 });

    expect(recommendations[0].experience.id).toBe('coffee');
  });
});

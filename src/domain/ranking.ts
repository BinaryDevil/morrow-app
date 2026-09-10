export type Relationship = 'friend' | 'taste-match' | 'public';

export type RankedExperience = {
  id: string;
  relationship: Relationship;
  tags: string[];
  distanceKm: number;
  hoursOld: number;
  contextualHearts: number;
};

export type FeedContext = {
  desiredTags: string[];
  currentHour: number;
};

const relationshipWeight: Record<Relationship, number> = {
  friend: 60,
  'taste-match': 38,
  public: 18,
};

export function rankExperiences(
  experiences: RankedExperience[],
  context: FeedContext,
): RankedExperience[] {
  const score = (experience: RankedExperience) => {
    const tagMatches = experience.tags.filter((tag) =>
      context.desiredTags.includes(tag),
    ).length;
    const proximity = Math.max(0, 12 - experience.distanceKm * 3);
    const freshness = Math.max(0, 16 - experience.hoursOld / 3);
    const agreement = Math.min(experience.contextualHearts, 8) * 2;
    const eveningBoost = context.currentHour >= 16 && context.currentHour <= 23 ? 2 : 0;

    return (
      relationshipWeight[experience.relationship] +
      tagMatches * 24 +
      proximity +
      freshness +
      agreement +
      eveningBoost
    );
  };

  return [...experiences].sort((a, b) => score(b) - score(a));
}

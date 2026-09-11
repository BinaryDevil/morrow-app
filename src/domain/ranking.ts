export type Relationship = 'follower' | 'taste-match' | 'public';

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
  intentTags?: string[];
  currentHour: number;
};

export type RankedRecommendation<T extends RankedExperience = RankedExperience> = {
  experience: T;
  explanation: string;
};

const relationshipWeight: Record<Relationship, number> = {
  follower: 60,
  'taste-match': 38,
  public: 18,
};

function intentTagsForHour(currentHour: number): string[] {
  if (currentHour >= 5 && currentHour < 11) return ['coffee', 'solo'];
  if (currentHour >= 11 && currentHour < 16) return ['food', 'catch-up'];
  if (currentHour >= 16 && currentHour <= 23) return ['drinks', 'friends', 'lively', 'catch-up'];
  return ['cozy', 'reset'];
}

function effectiveIntentTags(context: FeedContext): string[] {
  return context.intentTags ?? intentTagsForHour(context.currentHour);
}

function matchingTags(experience: RankedExperience, tags: readonly string[]): string[] {
  return experience.tags.filter((tag) => tags.includes(tag));
}

function scoreExperience(experience: RankedExperience, context: FeedContext): number {
  const tasteMatches = matchingTags(experience, context.desiredTags).length;
  const intentMatches = matchingTags(experience, effectiveIntentTags(context)).length;
  const proximity = Math.max(0, 12 - experience.distanceKm * 3);
  const freshness = Math.max(0, 16 - experience.hoursOld / 3);
  const agreement = Math.min(experience.contextualHearts, 8) * 2;
  const eveningBoost = context.currentHour >= 16 && context.currentHour <= 23 ? 2 : 0;

  return (
    relationshipWeight[experience.relationship] +
    tasteMatches * 24 +
    intentMatches * 24 +
    proximity +
    freshness +
    agreement +
    eveningBoost
  );
}

function relationshipExplanation(relationship: Relationship): string {
  switch (relationship) {
    case 'follower': return 'From someone you follow';
    case 'taste-match': return 'Shared by a taste-aligned local';
    case 'public': return 'A local discovery';
  }
}

function recommendationExplanation(experience: RankedExperience, context: FeedContext): string {
  const reasons = [relationshipExplanation(experience.relationship)];
  const intentMatch = matchingTags(experience, effectiveIntentTags(context))[0];
  const tasteMatch = matchingTags(experience, context.desiredTags)[0];

  if (intentMatch) reasons.push(`Fits your ${intentMatch} mood`);
  else if (tasteMatch) reasons.push(`Matches your taste for ${tasteMatch}`);
  else if (experience.distanceKm <= 3) reasons.push(`${experience.distanceKm} km away`);
  else if (experience.hoursOld <= 24) reasons.push('Shared recently');
  else if (experience.contextualHearts > 0) reasons.push('Loved in a similar context');

  const supportingSignals = [
    experience.distanceKm <= 3 ? `${experience.distanceKm} km away` : undefined,
    experience.hoursOld <= 24 ? 'shared recently' : undefined,
    experience.contextualHearts > 0 ? 'loved in a similar context' : undefined,
  ].filter((signal): signal is string => Boolean(signal));
  if (supportingSignals.length && reasons.length < 3) reasons.push(supportingSignals.join(', '));

  return reasons.slice(0, 3).join(' · ');
}

export function rankRecommendations<T extends RankedExperience>(
  experiences: readonly T[],
  context: FeedContext,
): RankedRecommendation<T>[] {
  return [...experiences]
    .sort((a, b) => scoreExperience(b, context) - scoreExperience(a, context))
    .map((experience) => ({ experience, explanation: recommendationExplanation(experience, context) }));
}

export function rankExperiences<T extends RankedExperience>(
  experiences: readonly T[],
  context: FeedContext,
): T[] {
  return rankRecommendations(experiences, context).map(({ experience }) => experience);
}

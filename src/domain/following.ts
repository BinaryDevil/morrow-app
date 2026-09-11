export type FollowRelationship = 'mutual-follower' | 'following' | 'follows-you' | 'none';

export type ExperienceWithAuthor = {
  authorId?: string;
};

export function relationshipFor(
  personId: string,
  followedPersonIds: ReadonlySet<string>,
  followerPersonIds: ReadonlySet<string>,
): FollowRelationship {
  const followsPerson = followedPersonIds.has(personId);
  const personFollowsYou = followerPersonIds.has(personId);

  if (followsPerson && personFollowsYou) return 'mutual-follower';
  if (followsPerson) return 'following';
  if (personFollowsYou) return 'follows-you';
  return 'none';
}

export function isFollowing(relationship: FollowRelationship): boolean {
  return relationship === 'following' || relationship === 'mutual-follower';
}

export function followRelationshipLabel(relationship: FollowRelationship): string {
  switch (relationship) {
    case 'mutual-follower': return 'Mutual follower';
    case 'following': return 'Following';
    case 'follows-you': return 'Follows you';
    case 'none': return 'Local to Morrow';
  }
}

export function visibleFollowingExperiences<T extends ExperienceWithAuthor>(
  experiences: readonly T[],
  followedPersonIds: ReadonlySet<string>,
): T[] {
  return experiences.filter((experience) => experience.authorId !== undefined && followedPersonIds.has(experience.authorId));
}

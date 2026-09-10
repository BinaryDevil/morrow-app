export type Visibility = 'followers' | 'private';

export type ExperienceDraftInput = {
  placeId: string;
  photoUri?: string;
  tags: string[];
  caption?: string;
  visibility: Visibility;
};

export type ExperienceDraft = ExperienceDraftInput & {
  kind: 'experience';
  createdAt: string;
};

export function createExperienceDraft(
  input: ExperienceDraftInput,
): ExperienceDraft {
  if (!input.placeId.trim()) {
    throw new Error('Choose a place before sharing your experience.');
  }
  return { ...input, kind: 'experience', createdAt: new Date().toISOString() };
}

export function toggleContextualHeart(
  agreeingUserIds: string[],
  userId: string,
): string[] {
  return agreeingUserIds.includes(userId)
    ? agreeingUserIds.filter((id) => id !== userId)
    : [...agreeingUserIds, userId];
}

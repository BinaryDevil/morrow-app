import { defaultLocationDisclosure, type LocationDisclosure } from './safety';

export type Visibility = 'followers' | 'private';

export type ExperienceDraftInput = {
  placeId: string;
  photoUri?: string;
  tags: string[];
  caption?: string;
  visibility: Visibility;
  locationDisclosure?: LocationDisclosure;
};

export type ExperienceDraft = ExperienceDraftInput & {
  kind: 'experience';
  createdAt: string;
  locationDisclosure: LocationDisclosure;
};

export function createExperienceDraft(
  input: ExperienceDraftInput,
): ExperienceDraft {
  if (!input.placeId.trim()) {
    throw new Error('Choose a place before sharing your experience.');
  }
  if (!input.photoUri && !input.caption?.trim()) {
    throw new Error('Add a photo or caption before sharing your experience.');
  }
  return {
    ...input,
    locationDisclosure: input.locationDisclosure ?? defaultLocationDisclosure,
    kind: 'experience',
    createdAt: new Date().toISOString(),
  };
}

export function toggleContextualHeart(
  agreeingUserIds: string[],
  userId: string,
): string[] {
  return agreeingUserIds.includes(userId)
    ? agreeingUserIds.filter((id) => id !== userId)
    : [...agreeingUserIds, userId];
}

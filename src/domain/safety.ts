export type LocationDisclosure = 'area' | 'exact';

export type ProfileVisibilityInput = {
  viewerId: string;
  profileId: string;
  isPublic: boolean;
  blockedPersonIds?: ReadonlySet<string>;
};

export type ExperienceLocation = {
  name: string;
  area: string;
  distanceKm: number;
};

export const defaultLocationDisclosure: LocationDisclosure = 'area';

export function isProfileVisibleTo({
  viewerId,
  profileId,
  isPublic,
  blockedPersonIds = new Set<string>(),
}: ProfileVisibilityInput): boolean {
  if (blockedPersonIds.has(profileId)) return false;
  return viewerId === profileId || isPublic;
}

export function visibleUnblockedExperiences<T extends { id: string }>(
  experiences: readonly T[],
  blockedExperienceIds: ReadonlySet<string>,
): T[] {
  return experiences.filter((experience) => !blockedExperienceIds.has(experience.id));
}

export function locationForExperience(
  location: ExperienceLocation,
  disclosure: LocationDisclosure,
): { place: string; area: string; distanceKm: number | undefined } {
  if (disclosure === 'exact') return { place: location.name, area: location.area, distanceKm: location.distanceKm };
  return { place: `A place in ${location.area}`, area: location.area, distanceKm: undefined };
}

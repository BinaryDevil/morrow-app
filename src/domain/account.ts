export type AccountProfile = {
  userId: string;
  displayName: string;
  tastePreferences: string[];
  savedPlaceIds: string[];
  isPublic: boolean;
};

export type AccountChanges = Omit<AccountProfile, 'userId'>;

export function createAccountProfile(userId: string, displayName: string): AccountProfile {
  return {
    userId,
    displayName: displayName.trim() || 'Morrow friend',
    tastePreferences: ['cozy'],
    savedPlaceIds: [],
    isPublic: true,
  };
}

export function applyAccountChanges(
  profile: AccountProfile,
  changes: AccountChanges,
): AccountProfile {
  return { ...profile, ...changes, displayName: changes.displayName.trim() || profile.displayName };
}

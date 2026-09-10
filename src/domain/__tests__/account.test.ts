import { applyAccountChanges, createAccountProfile } from '../account';

describe('account preferences seam', () => {
  it('keeps a person\'s identity, tastes, saves, and privacy together when updating an account', () => {
    const profile = createAccountProfile('user-42', 'Mia');

    expect(applyAccountChanges(profile, {
      displayName: 'Mia Chen',
      tastePreferences: ['cozy', 'outdoors'],
      savedPlaceIds: ['hillside-cafe'],
      isPublic: false,
    })).toEqual({
      userId: 'user-42',
      displayName: 'Mia Chen',
      tastePreferences: ['cozy', 'outdoors'],
      savedPlaceIds: ['hillside-cafe'],
      isPublic: false,
    });
  });
});

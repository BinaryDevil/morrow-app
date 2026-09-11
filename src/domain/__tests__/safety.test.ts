import {
  defaultLocationDisclosure,
  isProfileVisibleTo,
  locationForExperience,
} from '../safety';

describe('beta safety seam', () => {
  it('keeps private accounts out of local discovery while preserving access to your own profile', () => {
    expect(isProfileVisibleTo({ viewerId: 'maya', profileId: 'leo', isPublic: false })).toBe(false);
    expect(isProfileVisibleTo({ viewerId: 'maya', profileId: 'maya', isPublic: false })).toBe(true);
  });

  it('hides a profile whenever either person has blocked the other', () => {
    expect(isProfileVisibleTo({
      viewerId: 'maya', profileId: 'leo', isPublic: true, blockedPersonIds: new Set(['leo']),
    })).toBe(false);
  });

  it('shares an area, not an exact place or distance, by default', () => {
    expect(defaultLocationDisclosure).toBe('area');
    expect(locationForExperience({ name: 'Hillside Café', area: 'Steveston', distanceKm: 1.1 }, 'area')).toEqual({
      place: 'A place in Steveston', area: 'Steveston', distanceKm: undefined,
    });
  });

  it('only shows an exact place and distance when the author opts in', () => {
    expect(locationForExperience({ name: 'Hillside Café', area: 'Steveston', distanceKm: 1.1 }, 'exact')).toEqual({
      place: 'Hillside Café', area: 'Steveston', distanceKm: 1.1,
    });
  });
});

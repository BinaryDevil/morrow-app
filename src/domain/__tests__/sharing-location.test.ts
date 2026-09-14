import { resolveSharingLocation } from '../sharing-location';
import { seedPlaces } from '../places';

describe('sharing location selection seam', () => {
  it('uses the exact existing place selected on the full map', () => {
    expect(resolveSharingLocation({ kind: 'existing', placeId: 'hillside-cafe' }, seedPlaces)).toBe(seedPlaces[2]);
  });

  it('turns a dropped pin into the provisional location used by the experience draft', () => {
    expect(resolveSharingLocation({
      kind: 'pinned',
      name: 'Late-night noodles',
      address: '  8111 Anderson Road, Richmond, BC  ',
      category: 'food',
      coordinates: { latitude: 49.171, longitude: -123.139 },
    }, seedPlaces, '2026-09-14T12:00:00.000Z')).toMatchObject({
      id: 'late-night-noodles',
      name: 'Late-night noodles',
      address: '8111 Anderson Road, Richmond, BC',
      coordinates: { latitude: 49.171, longitude: -123.139 },
      verification: 'provisional',
    });
  });
});

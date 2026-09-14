import {
  browsePlaces,
  createProvisionalPinnedPlace,
  distanceFromMorrowKm,
  findPlace,
  seedPlaces,
  suggestPlace,
  type PlaceSuggestion,
} from '../places';

describe('Richmond place catalogue seam', () => {
  it('seeds browseable places across every launch category with provenance and verification', () => {
    expect(seedPlaces.map((place) => place.category)).toEqual(
      expect.arrayContaining(['food', 'drink', 'coffee', 'outdoors', 'culture']),
    );

    expect(seedPlaces.every((place) =>
      place.provenance === 'morrow-curated' && place.verification === 'verified',
    )).toBe(true);

    expect(seedPlaces.every((place) =>
      Number.isFinite(place.coordinates.latitude) && Number.isFinite(place.coordinates.longitude),
    )).toBe(true);
    expect(seedPlaces.every((place) => place.coordinateAccuracy === 'exact')).toBe(true);

    expect(seedPlaces.length).toBeGreaterThanOrEqual(50);
    expect(seedPlaces.every((place) => Boolean(place.imageUri))).toBe(true);
    expect(browsePlaces(seedPlaces, 'coffee').map((place) => place.id)).toEqual(
      expect.arrayContaining(['hillside-cafe', 'steveston-coffee']),
    );
  });

  it('turns an unlisted community suggestion into a provisional place without blocking the experience', () => {
    const suggestion: PlaceSuggestion = {
      name: 'Lansdowne Lanterns',
      area: 'Lansdowne',
      category: 'culture',
    };

    expect(suggestPlace(suggestion, '2026-09-10T12:00:00.000Z', ['lansdowne-lanterns'])).toEqual({
      id: 'lansdowne-lanterns-2',
      ...suggestion,
      provenance: 'community-suggested',
      verification: 'provisional',
      suggestedAt: '2026-09-10T12:00:00.000Z',
      coordinates: { latitude: 49.1666, longitude: -123.1336 },
      coordinateAccuracy: 'approximate',
    });
  });

  it('turns a dropped pin with a person-provided address into an exact provisional place', () => {
    expect(createProvisionalPinnedPlace({
      name: 'Late-night noodles',
      address: '  8111 Anderson Road, Richmond, BC  ',
      category: 'food',
      coordinates: { latitude: 49.171, longitude: -123.139 },
    }, '2026-09-11T12:00:00.000Z')).toEqual({
      id: 'late-night-noodles',
      name: 'Late-night noodles',
      area: 'Richmond',
      address: '8111 Anderson Road, Richmond, BC',
      category: 'food',
      coordinates: { latitude: 49.171, longitude: -123.139 },
      coordinateAccuracy: 'exact',
      provenance: 'community-suggested',
      verification: 'provisional',
      suggestedAt: '2026-09-11T12:00:00.000Z',
    });
  });

  it('requires an address before a dropped pin can become a provisional place', () => {
    expect(() => createProvisionalPinnedPlace({
      name: 'Late-night noodles',
      address: '   ',
      category: 'food',
      coordinates: { latitude: 49.171, longitude: -123.139 },
    })).toThrow('Add the address shown for this pin before continuing.');
  });

  it('uses a normalized name and area to find the same catalogue place', () => {
    expect(findPlace(seedPlaces, ' hillside café ', 'STEVESTON')).toMatchObject({
      id: 'hillside-cafe',
    });
  });

  it('measures a catalogue place from Morrow’s Richmond centre', () => {
    expect(distanceFromMorrowKm(seedPlaces[4])).toBeCloseTo(0.5, 1);
    expect(distanceFromMorrowKm(seedPlaces[2])).toBeGreaterThan(5);
  });
});

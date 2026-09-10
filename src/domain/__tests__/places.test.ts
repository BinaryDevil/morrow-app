import {
  browsePlaces,
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

    expect(browsePlaces(seedPlaces, 'coffee').map((place) => place.id)).toEqual([
      'hillside-cafe',
    ]);
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

  it('uses a normalized name and area to find the same catalogue place', () => {
    expect(findPlace(seedPlaces, ' hillside café ', 'STEVESTON')).toMatchObject({
      id: 'hillside-cafe',
    });
  });
});

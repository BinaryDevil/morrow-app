import { buildDiscoveryMapMarkers, experienceForDiscoveryMarker, markerTreatmentForCategory } from '../discovery-map';
import { morrowRichmondCentre, seedPlaces } from '../places';

describe('discovery map marker seam', () => {
  it('turns the ranked, visible feed into markers without changing its order or recommendation context', () => {
    const markers = buildDiscoveryMapMarkers([
      { id: 'first', placeId: 'hillside-cafe', place: 'Hillside Café', area: 'Steveston', explanation: 'From someone you follow', locationDisclosure: 'exact' },
      { id: 'second', placeId: 'richmond-art-gallery', place: 'A place in Minoru', area: 'Minoru', explanation: 'Matches your taste for culture', locationDisclosure: 'area' },
    ], seedPlaces);

    expect(markers).toEqual([
      {
        id: 'first',
        coordinates: seedPlaces[2].coordinates,
        title: 'Hillside Café',
        subtitle: 'From someone you follow',
        treatment: { color: '#D6A66A', icon: '☕', label: 'Coffee' },
      },
      {
        id: 'second',
        coordinates: morrowRichmondCentre,
        title: 'A place in Minoru',
        subtitle: 'Matches your taste for culture',
        treatment: { color: '#F1C75B', icon: '✺', label: 'Culture' },
      },
    ]);
  });

  it('keeps a visible experience on the map when its place is unavailable in the catalogue', () => {
    expect(buildDiscoveryMapMarkers([
      { id: 'missing', placeId: 'removed-place', place: 'Unknown', area: 'Richmond', explanation: 'Nearby', locationDisclosure: 'exact' },
    ], seedPlaces)).toEqual([{
      id: 'missing',
      coordinates: morrowRichmondCentre,
      title: 'Unknown',
      subtitle: 'Nearby',
      treatment: { color: '#8F82A8', icon: '✦', label: 'Recommendation' },
    }]);
  });

  it('uses explicit category treatments and a coherent fallback for new categories', () => {
    expect(markerTreatmentForCategory('culture')).toEqual({ color: '#F1C75B', icon: '✺', label: 'Culture' });
    expect(markerTreatmentForCategory('future-category')).toEqual({ color: '#8F82A8', icon: '✦', label: 'Recommendation' });
  });

  it('resolves a tapped marker to the same eligible recommendation that produced it', () => {
    const visibleFeed = [
      { id: 'first', place: 'Hillside Café' },
      { id: 'second', place: 'Iona Beach' },
    ];

    expect(experienceForDiscoveryMarker('second', visibleFeed)).toBe(visibleFeed[1]);
    expect(experienceForDiscoveryMarker('not-visible', visibleFeed)).toBeUndefined();
  });
});

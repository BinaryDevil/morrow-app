import type { LocationDisclosure } from './safety';
import { morrowRichmondCentre, type Place, type PlaceCoordinates } from './places';

export type DiscoveryMapInput = {
  id: string;
  placeId?: string;
  place: string;
  area: string;
  explanation: string;
  locationDisclosure: LocationDisclosure;
};

export type DiscoveryMapMarker = {
  id: string;
  coordinates: PlaceCoordinates;
  title: string;
  subtitle: string;
};

export function experienceForDiscoveryMarker<T extends { id: string }>(
  markerId: string,
  visibleFeed: readonly T[],
): T | undefined {
  return visibleFeed.find((experience) => experience.id === markerId);
}

export function buildDiscoveryMapMarkers(
  feed: readonly DiscoveryMapInput[],
  catalogue: readonly Place[],
): DiscoveryMapMarker[] {
  return feed.map((experience) => {
    const place = catalogue.find((candidate) => candidate.id === experience.placeId);

    return {
      id: experience.id,
      coordinates: experience.locationDisclosure === 'exact' && place ? place.coordinates : morrowRichmondCentre,
      title: experience.place,
      subtitle: experience.explanation,
    };
  });
}

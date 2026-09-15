import type { LocationDisclosure } from './safety';
import { morrowRichmondCentre, type Place, type PlaceCoordinates } from './places';

export type DiscoveryMapInput = {
  id: string;
  placeId?: string;
  place: string;
  area: string;
  explanation: string;
  tags?: readonly string[];
  locationDisclosure: LocationDisclosure;
};

export type DiscoveryMarkerTreatment = {
  color: string;
  icon: string;
  label: string;
};

export type DiscoveryMapMarker = {
  id: string;
  coordinates: PlaceCoordinates;
  title: string;
  subtitle: string;
  treatment: DiscoveryMarkerTreatment;
};

const defaultMarkerTreatment: DiscoveryMarkerTreatment = { color: '#8F82A8', icon: '✦', label: 'Recommendation' };
const markerTreatments: Record<string, DiscoveryMarkerTreatment> = {
  food: { color: '#F28B6D', icon: '●', label: 'Food' },
  drink: { color: '#C996F5', icon: '◆', label: 'Drinks' },
  coffee: { color: '#D6A66A', icon: '☕', label: 'Coffee' },
  outdoors: { color: '#76C7A0', icon: '✦', label: 'Outdoors' },
  culture: { color: '#F1C75B', icon: '✺', label: 'Culture' },
};

export function markerTreatmentForCategory(category?: string): DiscoveryMarkerTreatment {
  return markerTreatments[category ?? ''] ?? defaultMarkerTreatment;
}

function categoryFromTags(tags: readonly string[] = []): string | undefined {
  if (tags.includes('food')) return 'food';
  if (tags.includes('drinks')) return 'drink';
  if (tags.includes('coffee')) return 'coffee';
  if (tags.includes('outdoors')) return 'outdoors';
  if (tags.includes('culture')) return 'culture';
  return undefined;
}

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
      treatment: markerTreatmentForCategory(place?.category ?? categoryFromTags(experience.tags)),
    };
  });
}

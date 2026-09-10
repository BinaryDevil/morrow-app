export const launchCategories = ['food', 'drink', 'coffee', 'outdoors', 'culture'] as const;

export type PlaceCategory = (typeof launchCategories)[number];
export type PlaceProvenance = 'morrow-curated' | 'community-suggested';
export type PlaceVerification = 'verified' | 'provisional';
export type PlaceCoordinates = { latitude: number; longitude: number };
export type CoordinateAccuracy = 'exact' | 'approximate';

export type Place = {
  id: string;
  name: string;
  area: string;
  category: PlaceCategory;
  coordinates: PlaceCoordinates;
  coordinateAccuracy: CoordinateAccuracy;
  provenance: PlaceProvenance;
  verification: PlaceVerification;
  suggestedAt?: string;
};

export type PlaceSuggestion = Pick<Place, 'name' | 'area' | 'category'> & {
  coordinates?: PlaceCoordinates;
};

const richmondCentreCoordinates: PlaceCoordinates = { latitude: 49.1666, longitude: -123.1336 };

export const seedPlaces: Place[] = [
  { id: 'the-story-cafe', name: 'The Story Café', area: 'Bridgeport', category: 'food', coordinates: { latitude: 49.1934, longitude: -123.1296 }, coordinateAccuracy: 'exact', provenance: 'morrow-curated', verification: 'verified' },
  { id: 'little-mexico-cantina', name: 'Little Mexico Cantina', area: 'Steveston', category: 'drink', coordinates: { latitude: 49.1251, longitude: -123.1818 }, coordinateAccuracy: 'exact', provenance: 'morrow-curated', verification: 'verified' },
  { id: 'hillside-cafe', name: 'Hillside Café', area: 'Steveston', category: 'coffee', coordinates: { latitude: 49.1268, longitude: -123.1811 }, coordinateAccuracy: 'exact', provenance: 'morrow-curated', verification: 'verified' },
  { id: 'iona-beach', name: 'Iona Beach Regional Park', area: 'Sea Island', category: 'outdoors', coordinates: { latitude: 49.2168, longitude: -123.2049 }, coordinateAccuracy: 'exact', provenance: 'morrow-curated', verification: 'verified' },
  { id: 'richmond-art-gallery', name: 'Richmond Art Gallery', area: 'Minoru', category: 'culture', coordinates: { latitude: 49.1656, longitude: -123.1397 }, coordinateAccuracy: 'exact', provenance: 'morrow-curated', verification: 'verified' },
];

export function browsePlaces(places: Place[], category: PlaceCategory | 'all' = 'all'): Place[] {
  return category === 'all' ? places : places.filter((place) => place.category === category);
}

function normalizedText(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function placeIdBase(name: string): string {
  return normalizedText(name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'community-place';
}

export function findPlace(places: Place[], name: string, area: string): Place | undefined {
  const normalizedName = normalizedText(name);
  const normalizedArea = normalizedText(area);
  return places.find((place) =>
    normalizedText(place.name) === normalizedName && normalizedText(place.area) === normalizedArea,
  );
}

export function suggestPlace(
  suggestion: PlaceSuggestion,
  suggestedAt = new Date().toISOString(),
  existingIds: string[] = [],
): Place {
  const baseId = placeIdBase(suggestion.name);
  let suffix = 1;
  let uniqueId = baseId;
  while (existingIds.includes(uniqueId)) {
    suffix += 1;
    uniqueId = `${baseId}-${suffix}`;
  }

  return {
    id: uniqueId,
    ...suggestion,
    coordinates: suggestion.coordinates ?? richmondCentreCoordinates,
    coordinateAccuracy: suggestion.coordinates ? 'exact' : 'approximate',
    provenance: 'community-suggested',
    verification: 'provisional',
    suggestedAt,
  };
}

export const launchCategories = ['food', 'drink', 'coffee', 'outdoors', 'culture'] as const;

export type PlaceCategory = (typeof launchCategories)[number];
export type PlaceProvenance = 'morrow-curated' | 'community-suggested';
export type PlaceVerification = 'verified' | 'provisional';

export type Place = {
  id: string;
  name: string;
  area: string;
  category: PlaceCategory;
  provenance: PlaceProvenance;
  verification: PlaceVerification;
  suggestedAt?: string;
};

export type PlaceSuggestion = Pick<Place, 'name' | 'area' | 'category'>;

export const seedPlaces: Place[] = [
  { id: 'the-story-cafe', name: 'The Story Café', area: 'Richmond Centre', category: 'food', provenance: 'morrow-curated', verification: 'verified' },
  { id: 'little-mexico-cantina', name: 'Little Mexico Cantina', area: 'Steveston', category: 'drink', provenance: 'morrow-curated', verification: 'verified' },
  { id: 'hillside-cafe', name: 'Hillside Café', area: 'Steveston', category: 'coffee', provenance: 'morrow-curated', verification: 'verified' },
  { id: 'iona-beach', name: 'Iona Beach Regional Park', area: 'Sea Island', category: 'outdoors', provenance: 'morrow-curated', verification: 'verified' },
  { id: 'richmond-art-gallery', name: 'Richmond Art Gallery', area: 'Minoru', category: 'culture', provenance: 'morrow-curated', verification: 'verified' },
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
    provenance: 'community-suggested',
    verification: 'provisional',
    suggestedAt,
  };
}

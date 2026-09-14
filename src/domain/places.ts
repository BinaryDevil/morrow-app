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
  address?: string;
  category: PlaceCategory;
  imageUri?: string;
  note?: string;
  coordinates: PlaceCoordinates;
  coordinateAccuracy: CoordinateAccuracy;
  provenance: PlaceProvenance;
  verification: PlaceVerification;
  suggestedAt?: string;
};

export type PlaceSuggestion = Pick<Place, 'name' | 'area' | 'category'> & {
  address?: string;
  coordinates?: PlaceCoordinates;
};

export type PinnedPlaceSuggestion = Pick<Place, 'name' | 'category' | 'coordinates'> & {
  address: string;
  area?: string;
};

export const morrowRichmondCentre: PlaceCoordinates = { latitude: 49.1666, longitude: -123.1336 };

const catalogueImages: Record<PlaceCategory, string> = {
  food: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80',
  drink: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
  coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
  outdoors: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80',
  culture: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=900&q=80',
};

type CuratedPlace = Omit<Place, 'imageUri' | 'provenance' | 'verification' | 'coordinateAccuracy'>;
const curatedPlace = (place: CuratedPlace): Place => ({
  ...place,
  imageUri: catalogueImages[place.category],
  coordinateAccuracy: 'exact',
  provenance: 'morrow-curated',
  verification: 'verified',
});

export const seedPlaces: Place[] = [
  curatedPlace({ id: 'the-story-cafe', name: 'The Story Café', area: 'Bridgeport', category: 'food', note: 'Comfort food and an unhurried table.', coordinates: { latitude: 49.1934, longitude: -123.1296 } }),
  curatedPlace({ id: 'little-mexico-cantina', name: 'Little Mexico Cantina', area: 'Steveston', category: 'drink', note: 'A colourful late-night catch-up.', coordinates: { latitude: 49.1251, longitude: -123.1818 } }),
  curatedPlace({ id: 'hillside-cafe', name: 'Hillside Café', area: 'Steveston', category: 'coffee', note: 'A soft-light coffee pause.', coordinates: { latitude: 49.1268, longitude: -123.1811 } }),
  curatedPlace({ id: 'iona-beach', name: 'Iona Beach Regional Park', area: 'Sea Island', category: 'outdoors', note: 'Wide-sky walks and airport light.', coordinates: { latitude: 49.2168, longitude: -123.2049 } }),
  curatedPlace({ id: 'richmond-art-gallery', name: 'Richmond Art Gallery', area: 'Minoru', category: 'culture', note: 'A quiet hour with something new.', coordinates: { latitude: 49.1656, longitude: -123.1397 } }),
  curatedPlace({ id: 'fishermans-wharf', name: "Fisherman’s Wharf", area: 'Steveston', category: 'food', note: 'Fish and chips by the boats.', coordinates: { latitude: 49.1242, longitude: -123.1828 } }),
  curatedPlace({ id: 'steveston-coffee', name: 'Steveston Coffee Company', area: 'Steveston', category: 'coffee', note: 'Window seats and harbour strolls.', coordinates: { latitude: 49.1258, longitude: -123.1817 } }),
  curatedPlace({ id: 'britannia-shipyards', name: 'Britannia Shipyards', area: 'Steveston', category: 'culture', note: 'Heritage buildings on the Fraser.', coordinates: { latitude: 49.1218, longitude: -123.1824 } }),
  curatedPlace({ id: 'garry-point-park', name: 'Garry Point Park', area: 'Steveston', category: 'outdoors', note: 'Windy golden-hour shoreline.', coordinates: { latitude: 49.1232, longitude: -123.1913 } }),
  curatedPlace({ id: 'pajos', name: 'Pajo’s Fish & Chips', area: 'Steveston', category: 'food', note: 'A dockside classic worth sharing.', coordinates: { latitude: 49.1247, longitude: -123.1822 } }),
  curatedPlace({ id: 'lansdowne-centre', name: 'Lansdowne Centre', area: 'Lansdowne', category: 'food', note: 'A practical lunch stop with lots nearby.', coordinates: { latitude: 49.1746, longitude: -123.1328 } }),
  curatedPlace({ id: 'continental-shopping-centre', name: 'Continental Shopping Centre', area: 'Lansdowne', category: 'food', note: 'Noodles, pastries, and easy errands.', coordinates: { latitude: 49.1788, longitude: -123.1322 } }),
  curatedPlace({ id: 'coconut-grove', name: 'Coconut Grove', area: 'Lansdowne', category: 'drink', note: 'Tropical drinks for a long catch-up.', coordinates: { latitude: 49.1726, longitude: -123.136 } }),
  curatedPlace({ id: 'richmond-public-library', name: 'Richmond Public Library', area: 'City Centre', category: 'culture', note: 'A calm reset between plans.', coordinates: { latitude: 49.1669, longitude: -123.1365 } }),
  curatedPlace({ id: 'minoru-park', name: 'Minoru Park', area: 'Minoru', category: 'outdoors', note: 'Open paths, ponds, and a slow lap.', coordinates: { latitude: 49.1682, longitude: -123.1404 } }),
  curatedPlace({ id: 'cafe-de-lorangerie', name: "Café de l’Orangerie", area: 'Minoru', category: 'coffee', note: 'A bright little pastry break.', coordinates: { latitude: 49.1634, longitude: -123.1421 } }),
  curatedPlace({ id: 'richmond-olympic-oval', name: 'Richmond Olympic Oval', area: 'Waterfront', category: 'outdoors', note: 'River views with plenty of room to move.', coordinates: { latitude: 49.1692, longitude: -123.1466 } }),
  curatedPlace({ id: 'the-pier', name: 'The Pier at Richmond', area: 'Waterfront', category: 'drink', note: 'Blue-hour drinks near the river.', coordinates: { latitude: 49.1691, longitude: -123.1474 } }),
  curatedPlace({ id: 'tnt-lansdowne', name: 'T&T Supermarket', area: 'Lansdowne', category: 'food', note: 'Snack run material, always.', coordinates: { latitude: 49.1744, longitude: -123.1315 } }),
  curatedPlace({ id: 'alexandra-food-street', name: 'Alexandra Food Street', area: 'Golden Village', category: 'food', note: 'A choose-your-own dinner crawl.', coordinates: { latitude: 49.1819, longitude: -123.1348 } }),
  curatedPlace({ id: 'msg-bubble-tea', name: 'Message Tea House', area: 'Golden Village', category: 'drink', note: 'Sweet, cold, and built for a walk.', coordinates: { latitude: 49.1827, longitude: -123.1356 } }),
  curatedPlace({ id: 'bean-around-the-world', name: 'Bean Around the World', area: 'Golden Village', category: 'coffee', note: 'Good for an unrushed work session.', coordinates: { latitude: 49.1835, longitude: -123.1371 } }),
  curatedPlace({ id: 'yaohan-centre', name: 'Yaohan Centre', area: 'Golden Village', category: 'food', note: 'A compact stop for noodles and sweets.', coordinates: { latitude: 49.1832, longitude: -123.1341 } }),
  curatedPlace({ id: 'aberdeen-centre', name: 'Aberdeen Centre', area: 'Golden Village', category: 'culture', note: 'A little browsing, a lot of snacks.', coordinates: { latitude: 49.1846, longitude: -123.1332 } }),
  curatedPlace({ id: 'richmond-night-market', name: 'Richmond Night Market', area: 'Bridgeport', category: 'food', note: 'Go hungry and share everything.', coordinates: { latitude: 49.196, longitude: -123.1307 } }),
  curatedPlace({ id: 'river-rock-casino', name: 'River Rock Resort', area: 'Bridgeport', category: 'drink', note: 'A dressed-up night close to transit.', coordinates: { latitude: 49.1931, longitude: -123.1293 } }),
  curatedPlace({ id: 'sea-island-coffee', name: 'Sea Island Coffee', area: 'Bridgeport', category: 'coffee', note: 'A simple pre-flight or post-work pause.', coordinates: { latitude: 49.1936, longitude: -123.1278 } }),
  curatedPlace({ id: 'middle-arm-trail', name: 'Middle Arm Trail', area: 'Bridgeport', category: 'outdoors', note: 'A gentle waterfront loop.', coordinates: { latitude: 49.1838, longitude: -123.1481 } }),
  curatedPlace({ id: 'mcarthur-glen', name: 'McArthurGlen Designer Outlet', area: 'Sea Island', category: 'culture', note: 'A browse-and-coffee afternoon.', coordinates: { latitude: 49.1966, longitude: -123.181 } }),
  curatedPlace({ id: 'terra-nova-rural-park', name: 'Terra Nova Rural Park', area: 'Terra Nova', category: 'outdoors', note: 'Big skies, boardwalks, and bird calls.', coordinates: { latitude: 49.1862, longitude: -123.1794 } }),
  curatedPlace({ id: 'terra-nova-play-environment', name: 'Terra Nova Play Environment', area: 'Terra Nova', category: 'outdoors', note: 'A playful stop with an enormous view.', coordinates: { latitude: 49.1869, longitude: -123.1805 } }),
  curatedPlace({ id: 'dyke-trail', name: 'West Dyke Trail', area: 'Terra Nova', category: 'outdoors', note: 'The long way home at sunset.', coordinates: { latitude: 49.1934, longitude: -123.1906 } }),
  curatedPlace({ id: 'blundell-centre', name: 'Blundell Centre', area: 'Blundell', category: 'food', note: 'A low-key dinner close to home.', coordinates: { latitude: 49.1495, longitude: -123.1422 } }),
  curatedPlace({ id: 'coffee-lucca', name: 'Coffee Lucca', area: 'Blundell', category: 'coffee', note: 'Slow mornings and good people-watching.', coordinates: { latitude: 49.1488, longitude: -123.1391 } }),
  curatedPlace({ id: 'south-arm-community-centre', name: 'South Arm Community Centre', area: 'South Arm', category: 'culture', note: 'A local class, gallery, or activity.', coordinates: { latitude: 49.1388, longitude: -123.1269 } }),
  curatedPlace({ id: 'south-dyke-trail', name: 'South Dyke Trail', area: 'South Arm', category: 'outdoors', note: 'River air and a quiet stretch of path.', coordinates: { latitude: 49.138, longitude: -123.1501 } }),
  curatedPlace({ id: 'ironwood-plaza', name: 'Ironwood Plaza', area: 'Ironwood', category: 'food', note: 'An easy grocery-and-dinner detour.', coordinates: { latitude: 49.1324, longitude: -123.0929 } }),
  curatedPlace({ id: 'coppersmith-corner', name: 'Coppersmith Corner', area: 'Ironwood', category: 'drink', note: 'A friendly neighbourhood cheers.', coordinates: { latitude: 49.1335, longitude: -123.0956 } }),
  curatedPlace({ id: 'shell-road-trail', name: 'Shell Road Trail', area: 'Ironwood', category: 'outdoors', note: 'A green shortcut when you need one.', coordinates: { latitude: 49.1418, longitude: -123.0998 } }),
  curatedPlace({ id: 'king-george-park', name: 'King George Park', area: 'East Richmond', category: 'outdoors', note: 'A low-traffic reset after the day.', coordinates: { latitude: 49.1572, longitude: -123.0875 } }),
  curatedPlace({ id: 'garden-city-park', name: 'Garden City Community Park', area: 'Garden City', category: 'outdoors', note: 'Lake loop, lawns, and a picnic blanket.', coordinates: { latitude: 49.1579, longitude: -123.1235 } }),
  curatedPlace({ id: 'garden-city-lands', name: 'Garden City Lands', area: 'Garden City', category: 'outdoors', note: 'Meadow paths with a surprising hush.', coordinates: { latitude: 49.1757, longitude: -123.1205 } }),
  curatedPlace({ id: 'paulikkas-pottery', name: 'Paulikka’s Pottery', area: 'Garden City', category: 'culture', note: 'A hands-on afternoon idea.', coordinates: { latitude: 49.1606, longitude: -123.1211 } }),
  curatedPlace({ id: 'kingswood-coffee', name: 'Kingswood Coffee', area: 'Garden City', category: 'coffee', note: 'A familiar stop for an everyday ritual.', coordinates: { latitude: 49.1591, longitude: -123.1199 } }),
  curatedPlace({ id: 'kerrisdale-arena', name: 'Richmond Ice Centre', area: 'City Centre', category: 'culture', note: 'Skates, rink air, and a different kind of evening.', coordinates: { latitude: 49.1796, longitude: -123.1334 } }),
  curatedPlace({ id: 'kingsland-kitchen', name: 'Kingsland Kitchen', area: 'City Centre', category: 'food', note: 'A dinner-table kind of place.', coordinates: { latitude: 49.1683, longitude: -123.1322 } }),
  curatedPlace({ id: 'the-roof-cafe', name: 'The Roof Café', area: 'City Centre', category: 'coffee', note: 'A little height and a little quiet.', coordinates: { latitude: 49.1677, longitude: -123.1343 } }),
  curatedPlace({ id: 'templeton-park', name: 'Templeton Park', area: 'Sea Island', category: 'outdoors', note: 'Fields, space, and a quick breath of air.', coordinates: { latitude: 49.1987, longitude: -123.1631 } }),
  curatedPlace({ id: 'iona-island-causeway', name: 'Iona Island Causeway', area: 'Sea Island', category: 'outdoors', note: 'A straight line toward open water.', coordinates: { latitude: 49.2221, longitude: -123.2124 } }),
  curatedPlace({ id: 'vancouver-international-airport', name: 'YVR Observation Area', area: 'Sea Island', category: 'culture', note: 'Planes, dusk, and a change of scene.', coordinates: { latitude: 49.1947, longitude: -123.1815 } }),
  curatedPlace({ id: 'lulu-island-winery', name: 'Lulu Island Winery', area: 'East Richmond', category: 'drink', note: 'A slow afternoon tasting.', coordinates: { latitude: 49.157, longitude: -123.081 } }),
  curatedPlace({ id: 'historic-fishing-village', name: 'Steveston Museum', area: 'Steveston', category: 'culture', note: 'A small window into the village’s past.', coordinates: { latitude: 49.1254, longitude: -123.1825 } }),
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
    coordinates: suggestion.coordinates ?? morrowRichmondCentre,
    coordinateAccuracy: suggestion.coordinates ? 'exact' : 'approximate',
    provenance: 'community-suggested',
    verification: 'provisional',
    suggestedAt,
  };
}

export function createProvisionalPinnedPlace(
  suggestion: PinnedPlaceSuggestion,
  suggestedAt = new Date().toISOString(),
  existingIds: string[] = [],
): Place {
  const address = suggestion.address.trim();
  if (!address) throw new Error('Add the address shown for this pin before continuing.');

  return suggestPlace({
    name: suggestion.name.trim() || 'Pinned location',
    area: suggestion.area?.trim() || 'Richmond',
    address,
    category: suggestion.category,
    coordinates: suggestion.coordinates,
  }, suggestedAt, existingIds);
}

export function distanceFromMorrowKm(place: Pick<Place, 'coordinates'>): number {
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const latitudeDifference = toRadians(place.coordinates.latitude - morrowRichmondCentre.latitude);
  const longitudeDifference = toRadians(place.coordinates.longitude - morrowRichmondCentre.longitude);
  const latitudeStart = toRadians(morrowRichmondCentre.latitude);
  const latitudeEnd = toRadians(place.coordinates.latitude);
  const haversine = Math.sin(latitudeDifference / 2) ** 2
    + Math.cos(latitudeStart) * Math.cos(latitudeEnd) * Math.sin(longitudeDifference / 2) ** 2;

  return Math.round(2 * 6_371 * Math.asin(Math.sqrt(haversine)) * 10) / 10;
}

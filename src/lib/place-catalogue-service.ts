import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCategories, type Place } from '../domain/places';

const provisionalPlacesKey = 'morrow.provisional-places';

function isProvisionalPlace(value: unknown): value is Place {
  if (!value || typeof value !== 'object') return false;
  const place = value as Partial<Place>;
  return place.provenance === 'community-suggested'
    && place.verification === 'provisional'
    && typeof place.id === 'string' && Boolean(place.id.trim())
    && typeof place.name === 'string' && Boolean(place.name.trim())
    && typeof place.area === 'string' && Boolean(place.area.trim())
    && launchCategories.includes(place.category as typeof launchCategories[number])
    && Number.isFinite(place.coordinates?.latitude)
    && Number.isFinite(place.coordinates?.longitude)
    && place.coordinates!.latitude >= -90 && place.coordinates!.latitude <= 90
    && place.coordinates!.longitude >= -180 && place.coordinates!.longitude <= 180
    && (place.coordinateAccuracy === 'approximate' || place.coordinateAccuracy === 'exact')
    && typeof place.suggestedAt === 'string'
    && !Number.isNaN(Date.parse(place.suggestedAt));
}

export async function loadProvisionalPlaces(): Promise<Place[]> {
  const stored = await AsyncStorage.getItem(provisionalPlacesKey);
  if (!stored) return [];

  try {
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isProvisionalPlace) : [];
  } catch {
    return [];
  }
}

export function saveProvisionalPlaces(places: Place[]): Promise<void> {
  return AsyncStorage.setItem(provisionalPlacesKey, JSON.stringify(places));
}

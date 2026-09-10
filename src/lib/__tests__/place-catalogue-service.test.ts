jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loadProvisionalPlaces,
  saveProvisionalPlaces,
} from '../place-catalogue-service';
import type { Place } from '../../domain/places';

const provisionalPlace: Place = {
  id: 'lansdowne-lanterns',
  name: 'Lansdowne Lanterns',
  area: 'Lansdowne',
  category: 'culture',
  coordinates: { latitude: 49.174, longitude: -123.132 },
  coordinateAccuracy: 'approximate',
  provenance: 'community-suggested',
  verification: 'provisional',
  suggestedAt: '2026-09-10T12:00:00.000Z',
};

describe('provisional place catalogue storage', () => {
  beforeEach(async () => { jest.clearAllMocks(); await AsyncStorage.clear(); });

  it('restores a saved provisional place after an app reload', async () => {
    await saveProvisionalPlaces([provisionalPlace]);

    await expect(loadProvisionalPlaces()).resolves.toEqual([provisionalPlace]);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'morrow.provisional-places',
      JSON.stringify([provisionalPlace]),
    );
  });

  it('keeps valid exact-coordinate suggestions and rejects malformed stored records', async () => {
    const exactPlace = { ...provisionalPlace, coordinateAccuracy: 'exact' as const };
    await AsyncStorage.setItem('morrow.provisional-places', JSON.stringify([
      exactPlace,
      { ...provisionalPlace, category: 'not-a-category', coordinates: { latitude: 200, longitude: 0 } },
    ]));

    await expect(loadProvisionalPlaces()).resolves.toEqual([exactPlace]);
  });
});

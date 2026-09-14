import {
  createProvisionalPinnedPlace,
  type PinnedPlaceSuggestion,
  type Place,
} from './places';

export type SharingLocationSelection =
  | { kind: 'existing'; placeId: string }
  | ({ kind: 'pinned' } & PinnedPlaceSuggestion);

export function resolveSharingLocation(
  selection: SharingLocationSelection,
  places: readonly Place[],
  suggestedAt?: string,
): Place {
  if (selection.kind === 'existing') {
    const place = places.find((candidate) => candidate.id === selection.placeId);
    if (!place) throw new Error('Choose a place from the map before sharing your experience.');
    return place;
  }

  return createProvisionalPinnedPlace(selection, suggestedAt, places.map((place) => place.id));
}

export type DiscoverySurface = 'feed' | 'map';

export type DiscoverySwitcherOption = {
  accessibilityLabel: string;
  accessibilityState: { selected: boolean };
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  labelColor: string;
};

export function discoverySwitcherOption(surface: DiscoverySurface, selectedSurface: DiscoverySurface): DiscoverySwitcherOption {
  const selected = surface === selectedSurface;

  return {
    accessibilityLabel: `Show ${surface}`,
    accessibilityState: { selected },
    backgroundColor: selected ? '#BDA8FF' : 'transparent',
    borderColor: selected ? '#FFF8FF' : 'transparent',
    borderWidth: 2,
    labelColor: selected ? '#211A31' : '#FFF8FF',
  };
}

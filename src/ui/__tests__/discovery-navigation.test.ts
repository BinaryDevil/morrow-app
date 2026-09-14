import { discoverySwitcherOption } from '../discovery-navigation';

describe('discovery switcher seam', () => {
  it('gives the selected discovery surface an explicit accessible state and high-contrast treatment', () => {
    expect(discoverySwitcherOption('feed', 'feed')).toEqual({
      accessibilityLabel: 'Show feed',
      accessibilityState: { selected: true },
      backgroundColor: '#BDA8FF',
      borderColor: '#FFF8FF',
      borderWidth: 2,
      labelColor: '#211A31',
    });
  });

  it('keeps an unselected discovery surface visible without presenting it as active', () => {
    expect(discoverySwitcherOption('map', 'feed')).toEqual({
      accessibilityLabel: 'Show map',
      accessibilityState: { selected: false },
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderWidth: 2,
      labelColor: '#FFF8FF',
    });
  });
});

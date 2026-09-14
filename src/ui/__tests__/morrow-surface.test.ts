import { morrowSurfaceAppearance } from '../morrow-surface';

describe('Morrow surface appearance seam', () => {
  it('uses a dark translucent material with a visible edge over changing feed and map content', () => {
    expect(morrowSurfaceAppearance({ reducedTransparency: false })).toEqual({
      backgroundColor: 'rgba(25,19,37,0.78)',
      borderColor: 'rgba(255,248,255,0.28)',
      borderWidth: 1,
      useBlur: true,
    });
  });

  it('uses an opaque high-contrast material when transparency is reduced or blur is unavailable', () => {
    expect(morrowSurfaceAppearance({ reducedTransparency: true })).toEqual({
      backgroundColor: '#211A31',
      borderColor: '#817695',
      borderWidth: 1,
      useBlur: false,
    });

    expect(morrowSurfaceAppearance({ reducedTransparency: false, blurSupported: false })).toEqual({
      backgroundColor: '#211A31',
      borderColor: '#817695',
      borderWidth: 1,
      useBlur: false,
    });
  });
});

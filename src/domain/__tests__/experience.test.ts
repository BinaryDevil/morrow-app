import {
  createExperienceDraft,
  toggleContextualHeart,
  type ExperienceDraftInput,
} from '../experience';

const input: ExperienceDraftInput = {
  placeId: 'hillside-cafe',
  photoUri: 'file://photo.jpg',
  tags: ['cozy', 'catch-up'],
  caption: 'Soft rain, warm light, easy conversation.',
  visibility: 'followers',
};

describe('experience creation seam', () => {
  it('creates an intentional, location-linked experience draft', () => {
    expect(createExperienceDraft(input)).toEqual({
      ...input,
      locationDisclosure: 'area',
      kind: 'experience',
      createdAt: expect.any(String),
    });
  });

  it('requires a confirmed place before creating an experience', () => {
    expect(() => createExperienceDraft({ ...input, placeId: '   ' })).toThrow(
      'Choose a place before sharing your experience.',
    );
  });

  it('requires either a photo or a nonblank caption', () => {
    expect(() => createExperienceDraft({ ...input, photoUri: undefined, caption: '   ' })).toThrow(
      'Add a photo or caption before sharing your experience.',
    );
  });

  it('treats the contextual heart as agreement, not a generic like', () => {
    expect(toggleContextualHeart([], 'maya')).toEqual(['maya']);
    expect(toggleContextualHeart(['maya', 'leo'], 'maya')).toEqual(['leo']);
  });
});

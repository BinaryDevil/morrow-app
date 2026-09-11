import { relationshipFor, visibleFollowingExperiences } from '../following';

describe('following seam', () => {
  it('identifies people who follow each other as mutual followers', () => {
    expect(relationshipFor('maya', new Set(['maya']), new Set(['maya']))).toBe('mutual-follower');
    expect(relationshipFor('maya', new Set(['maya']), new Set())).toBe('following');
    expect(relationshipFor('maya', new Set(), new Set(['maya']))).toBe('follows-you');
    expect(relationshipFor('maya', new Set(), new Set())).toBe('none');
  });

  it('shows only recent experiences from followed people in the Following destination', () => {
    const experiences = [
      { id: 'm', authorId: 'maya', createdAt: '2026-09-11T12:00:00.000Z' },
      { id: 'l', authorId: 'leo', createdAt: '2026-09-11T11:00:00.000Z' },
      { id: 'me', authorId: 'me', createdAt: '2026-09-11T10:00:00.000Z' },
    ];

    expect(visibleFollowingExperiences(experiences, new Set(['maya']))).toEqual([experiences[0]]);
  });
});

import { filterExperiencesByActivity } from '../intent-filter';

const experiences = [
  { id: 'quiet-drink', tags: ['drinks', 'cozy'] },
  { id: 'dinner', tags: ['food', 'friends'] },
  { id: 'party', tags: ['lively', 'friends', 'drinks'] },
];

describe('activity filtering', () => {
  it('shows only experiences matching the selected activity', () => {
    expect(filterExperiencesByActivity(experiences, 'drinks').map(({ id }) => id)).toEqual(['quiet-drink', 'party']);
    expect(filterExperiencesByActivity(experiences, 'party').map(({ id }) => id)).toEqual(['party']);
  });

  it('restores all experiences when no activity is selected', () => {
    expect(filterExperiencesByActivity(experiences).map(({ id }) => id)).toEqual(['quiet-drink', 'dinner', 'party']);
  });
});

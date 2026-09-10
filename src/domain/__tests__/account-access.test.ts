import { accountActionSignInPrompt } from '../account-access';

describe('account action access seam', () => {
  it('explains why a guest should sign in before an account-only action', () => {
    expect(accountActionSignInPrompt('save-place')).toBe(
      'Sign in to save places to your Morrow.',
    );
    expect(accountActionSignInPrompt('share-place')).toBe(
      'Sign in to share this place with your people.',
    );
    expect(accountActionSignInPrompt('edit-preferences')).toBe(
      'Sign in to make Morrow yours with your taste preferences.',
    );
  });
});

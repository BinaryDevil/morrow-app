export type AccountOnlyAction = 'save-place' | 'share-place' | 'edit-preferences';

export function accountActionSignInPrompt(action: AccountOnlyAction): string {
  switch (action) {
    case 'save-place':
      return 'Sign in to save places to your Morrow.';
    case 'share-place':
      return 'Sign in to share this place with your people.';
    case 'edit-preferences':
      return 'Sign in to make Morrow yours with your taste preferences.';
  }
}

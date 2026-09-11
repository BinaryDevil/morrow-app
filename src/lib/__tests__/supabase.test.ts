jest.mock('@supabase/supabase-js', () => ({ createClient: jest.fn(() => ({})) }));
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  removeItemAsync: jest.fn(),
}));
jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));
jest.mock('@react-native-async-storage/async-storage', () => ({}));
jest.mock('react-native-url-polyfill/auto', () => ({}));

describe('Supabase authentication configuration', () => {
  const originalEnvironment = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnvironment,
      EXPO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test-key',
    };
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  it('uses PKCE because native Google sign-in exchanges an authorization code', () => {
    jest.isolateModules(() => {
      require('../supabase');

      const { createClient } = require('@supabase/supabase-js');

      expect(createClient).toHaveBeenCalledWith(
        'https://example.supabase.co',
        'test-key',
        expect.objectContaining({
          auth: expect.objectContaining({ flowType: 'pkce' }),
        }),
      );
    });
  });
});

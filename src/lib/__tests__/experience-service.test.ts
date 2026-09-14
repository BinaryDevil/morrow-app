const mockUpload = jest.fn().mockResolvedValue({ error: null });
const mockInsert = jest.fn(() => ({
  select: jest.fn(() => ({
    single: jest.fn().mockResolvedValue({
      data: {
        id: 'experience-1',
        author_id: 'person-1',
        place_id: 'hillside-cafe',
        photo_path: 'person-1/photo.jpg',
        photo_url: null,
        caption: 'A quiet afternoon.',
        tags: ['cozy'],
        visibility: 'followers',
        location_disclosure: 'area',
        created_at: '2026-09-14T00:00:00.000Z',
        contextual_heart_count: 0,
      },
      error: null,
    }),
  })),
}));

jest.mock('../supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: mockUpload,
        createSignedUrl: jest.fn().mockResolvedValue({ data: { signedUrl: 'https://example.com/photo.jpg' }, error: null }),
      })),
    },
    from: jest.fn(() => ({ insert: mockInsert })),
  },
  supabaseConfigurationError: 'not configured',
}));
jest.mock('expo-crypto', () => ({ randomUUID: jest.fn(() => 'photo-id') }));

import { createExperience } from '../experience-service';

describe('experience photo sharing', () => {
  const originalCrypto = globalThis.crypto;
  const originalFetchDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'fetch');

  beforeEach(() => {
    Object.defineProperty(globalThis, 'fetch', { configurable: true, value: jest.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(1)),
      headers: { get: jest.fn(() => 'image/jpeg') },
    }) });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'crypto', { configurable: true, value: originalCrypto });
    if (originalFetchDescriptor) Object.defineProperty(globalThis, 'fetch', originalFetchDescriptor);
    else delete (globalThis as { fetch?: typeof fetch }).fetch;
  });

  it('uploads a selected photo when the native runtime has no global crypto object', async () => {
    Object.defineProperty(globalThis, 'crypto', { configurable: true, value: undefined });

    await expect(createExperience('person-1', {
      placeId: 'hillside-cafe',
      photoUri: 'file:///photo.jpg',
      caption: 'A quiet afternoon.',
      tags: ['cozy'],
      visibility: 'followers',
    })).resolves.toMatchObject({ id: 'experience-1' });

    expect(mockUpload).toHaveBeenCalledWith(
      'person-1/photo-id.jpg',
      expect.any(ArrayBuffer),
      expect.objectContaining({ contentType: 'image/jpeg' }),
    );
  });
});

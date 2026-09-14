import type { ExperienceDraft, ExperienceDraftInput, Visibility } from '../domain/experience';
import { randomUUID } from 'expo-crypto';
import { defaultLocationDisclosure, type LocationDisclosure } from '../domain/safety';
import { createExperienceDraft } from '../domain/experience';
import { supabase, supabaseConfigurationError } from './supabase';

export type PersistedExperience = ExperienceDraft & {
  id: string;
  authorId: string;
  contextualHearts: number;
};

type ExperienceRow = {
  id: string;
  author_id: string;
  place_id: string;
  photo_path: string | null;
  photo_url: string | null;
  caption: string | null;
  tags: string[];
  visibility: Visibility;
  location_disclosure: LocationDisclosure | null;
  created_at: string;
  contextual_heart_count: number | null;
};

async function toPersistedExperience(row: ExperienceRow): Promise<PersistedExperience> {
  let photoUri: string | undefined;
  if (row.photo_path) {
    if (!supabase) throw new Error(supabaseConfigurationError);
    const { data, error } = await supabase.storage.from('experience-photos').createSignedUrl(row.photo_path, 60 * 60);
    if (error || !data?.signedUrl) throw error ?? new Error('Could not load an experience photo.');
    photoUri = data.signedUrl;
  } else if (row.photo_url) {
    photoUri = row.photo_url;
  }
  return {
    id: row.id,
    authorId: row.author_id,
    placeId: row.place_id,
    photoUri,
    caption: row.caption ?? undefined,
    tags: row.tags ?? [],
    visibility: row.visibility,
    locationDisclosure: row.location_disclosure ?? defaultLocationDisclosure,
    kind: 'experience',
    createdAt: row.created_at,
    contextualHearts: row.contextual_heart_count ?? 0,
  };
}

function photoPath(userId: string, uri: string): string {
  const extension = uri.split('?')[0].split('.').pop()?.toLowerCase();
  const safeExtension = extension && /^[a-z0-9]{1,5}$/.test(extension) ? extension : 'jpg';
  return `${userId}/${randomUUID()}.${safeExtension}`;
}

async function uploadExperiencePhoto(userId: string, uri: string): Promise<string> {
  if (!supabase) throw new Error(supabaseConfigurationError);
  const response = await fetch(uri);
  if (!response.ok) throw new Error('Could not read the selected photo.');
  const path = photoPath(userId, uri);
  const { error } = await supabase.storage.from('experience-photos').upload(
    path,
    await response.arrayBuffer(),
    { contentType: response.headers.get('content-type') ?? 'image/jpeg' },
  );
  if (error) throw error;
  return path;
}

export async function createExperience(
  userId: string,
  input: ExperienceDraftInput,
): Promise<PersistedExperience> {
  if (!supabase) throw new Error(supabaseConfigurationError);
  const draft = createExperienceDraft(input);
  const photoPath = draft.photoUri ? await uploadExperiencePhoto(userId, draft.photoUri) : null;
  const { data, error } = await supabase.from('experiences').insert({
    author_id: userId,
    place_id: draft.placeId,
    photo_path: photoPath,
    caption: draft.caption?.trim() || null,
    tags: draft.tags,
    visibility: draft.visibility,
    location_disclosure: draft.locationDisclosure,
  }).select('*').single();
  if (error) throw error;
  return toPersistedExperience(data as ExperienceRow);
}

export async function loadExperiences(viewerId: string): Promise<PersistedExperience[]> {
  if (!supabase) throw new Error(supabaseConfigurationError);
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (user?.id !== viewerId) throw new Error('Could not verify your Morrow account.');
  const { data, error } = await supabase.from('experiences').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return Promise.all((data as ExperienceRow[]).map(toPersistedExperience));
}

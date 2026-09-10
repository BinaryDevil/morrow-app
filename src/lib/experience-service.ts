import type { ExperienceDraft, ExperienceDraftInput, Visibility } from '../domain/experience';
import { createExperienceDraft } from '../domain/experience';
import { supabase, supabaseConfigurationError } from './supabase';

export type PersistedExperience = ExperienceDraft & {
  id: string;
  authorId: string;
};

type ExperienceRow = {
  id: string;
  author_id: string;
  place_id: string;
  photo_url: string | null;
  caption: string | null;
  tags: string[];
  visibility: Visibility;
  created_at: string;
};

function toPersistedExperience(row: ExperienceRow): PersistedExperience {
  return {
    id: row.id,
    authorId: row.author_id,
    placeId: row.place_id,
    photoUri: row.photo_url ?? undefined,
    caption: row.caption ?? undefined,
    tags: row.tags ?? [],
    visibility: row.visibility,
    kind: 'experience',
    createdAt: row.created_at,
  };
}

function photoPath(userId: string, uri: string): string {
  const extension = uri.split('?')[0].split('.').pop()?.toLowerCase();
  const safeExtension = extension && /^[a-z0-9]{1,5}$/.test(extension) ? extension : 'jpg';
  return `${userId}/${crypto.randomUUID()}.${safeExtension}`;
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
  const { data } = await supabase.storage.from('experience-photos').createSignedUrl(path, 60 * 60 * 24 * 365);
  if (!data?.signedUrl) throw new Error('Could not prepare the selected photo.');
  return data.signedUrl;
}

export async function createExperience(
  userId: string,
  input: ExperienceDraftInput,
): Promise<PersistedExperience> {
  if (!supabase) throw new Error(supabaseConfigurationError);
  const draft = createExperienceDraft(input);
  const photoUrl = draft.photoUri ? await uploadExperiencePhoto(userId, draft.photoUri) : null;
  const { data, error } = await supabase.from('experiences').insert({
    author_id: userId,
    place_id: draft.placeId,
    photo_url: photoUrl,
    caption: draft.caption?.trim() || null,
    tags: draft.tags,
    visibility: draft.visibility,
  }).select('*').single();
  if (error) throw error;
  return toPersistedExperience(data as ExperienceRow);
}

export async function loadExperiences(userId: string): Promise<PersistedExperience[]> {
  if (!supabase) throw new Error(supabaseConfigurationError);
  const { data, error } = await supabase.from('experiences').select('*').eq('author_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data as ExperienceRow[]).map(toPersistedExperience);
}

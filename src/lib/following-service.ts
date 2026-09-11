import { relationshipFor, type FollowRelationship } from '../domain/following';
import { supabase, supabaseConfigurationError } from './supabase';

export type LocalPerson = {
  userId: string;
  displayName: string;
  relationship: FollowRelationship;
};

type ProfileRow = {
  id: string;
  display_name: string;
};

type FollowRow = {
  follower_id: string;
  followed_id: string;
};

async function verifyAccount(userId: string) {
  if (!supabase) throw new Error(supabaseConfigurationError);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (user?.id !== userId) throw new Error('Could not verify your Morrow account.');
}

export async function loadLocalPeople(userId: string): Promise<LocalPerson[]> {
  if (!supabase) throw new Error(supabaseConfigurationError);
  const [profilesResult, outgoingResult, incomingResult] = await Promise.all([
    supabase.from('profiles').select('id, display_name').eq('is_public', true).neq('id', userId).order('display_name'),
    supabase.from('follows').select('followed_id').eq('follower_id', userId),
    supabase.from('follows').select('follower_id').eq('followed_id', userId),
  ]);
  const error = profilesResult.error ?? outgoingResult.error ?? incomingResult.error;
  if (error) throw error;

  const followedPersonIds = new Set((outgoingResult.data as FollowRow[] ?? []).map((follow) => follow.followed_id));
  const followerPersonIds = new Set((incomingResult.data as FollowRow[] ?? []).map((follow) => follow.follower_id));

  return ((profilesResult.data as ProfileRow[] ?? []).map((profile) => ({
    userId: profile.id,
    displayName: profile.display_name,
    relationship: relationshipFor(profile.id, followedPersonIds, followerPersonIds),
  })));
}

export async function followPerson(userId: string, personId: string): Promise<void> {
  await verifyAccount(userId);
  if (userId === personId) throw new Error('You cannot follow your own profile.');
  const { error } = await supabase!.from('follows').insert({ follower_id: userId, followed_id: personId });
  if (error) throw error;
}

export async function unfollowPerson(userId: string, personId: string): Promise<void> {
  await verifyAccount(userId);
  const { error } = await supabase!.from('follows').delete().eq('follower_id', userId).eq('followed_id', personId);
  if (error) throw error;
}

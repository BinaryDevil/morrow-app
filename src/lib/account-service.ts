import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import type { Session, User } from '@supabase/supabase-js';
import { applyAccountChanges, createAccountProfile, type AccountChanges, type AccountProfile } from '../domain/account';
import { supabase, supabaseConfigurationError } from './supabase';

WebBrowser.maybeCompleteAuthSession();

type ProfileRow = {
  id: string;
  display_name: string;
  taste_preferences: string[];
  saved_place_ids: string[];
  is_public: boolean;
};

function toAccountProfile(row: ProfileRow): AccountProfile {
  return {
    userId: row.id,
    displayName: row.display_name,
    tastePreferences: row.taste_preferences ?? [],
    savedPlaceIds: row.saved_place_ids ?? [],
    isPublic: row.is_public,
  };
}

function defaultDisplayName(user: User) {
  const name = user.user_metadata.full_name ?? user.user_metadata.name;
  return typeof name === 'string' && name.trim() ? name : user.email?.split('@')[0] ?? 'Morrow friend';
}

export async function loadAccountProfile(user: User): Promise<AccountProfile> {
  if (!supabase) throw new Error(supabaseConfigurationError);
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (error) throw error;
  if (data) return toAccountProfile(data as ProfileRow);

  const profile = createAccountProfile(user.id, defaultDisplayName(user));
  const { error: insertError } = await supabase.from('profiles').insert({
    id: profile.userId,
    display_name: profile.displayName,
    taste_preferences: profile.tastePreferences,
    saved_place_ids: profile.savedPlaceIds,
    is_public: profile.isPublic,
  });
  if (insertError) throw insertError;
  return profile;
}

export async function saveAccountProfile(profile: AccountProfile, changes: AccountChanges) {
  if (!supabase) throw new Error(supabaseConfigurationError);
  const nextProfile = applyAccountChanges(profile, changes);
  const { error } = await supabase.from('profiles').update({
    display_name: nextProfile.displayName,
    taste_preferences: nextProfile.tastePreferences,
    saved_place_ids: nextProfile.savedPlaceIds,
    is_public: nextProfile.isPublic,
  }).eq('id', profile.userId);
  if (error) throw error;
  return nextProfile;
}

export async function signInWithPassword(email: string, password: string) {
  if (!supabase) throw new Error(supabaseConfigurationError);
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
}

export async function signUpWithPassword(email: string, password: string) {
  if (!supabase) throw new Error(supabaseConfigurationError);
  const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
  if (error) throw error;
  return data.session;
}

export async function signInWithGoogle() {
  if (!supabase) throw new Error(supabaseConfigurationError);
  const redirectTo = Linking.createURL('auth/callback');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error || !data.url) throw error ?? new Error('Google sign-in could not be started.');
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success' || !result.url) return;
  const code = new URL(result.url).searchParams.get('code');
  if (!code) throw new Error('Google did not return a sign-in code.');
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) throw exchangeError;
}

export async function getStoredSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

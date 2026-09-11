import { supabase } from './supabase';

export const betaEventTypes = [
  'app_opened',
  'experience_viewed',
  'place_saved',
  'experience_shared',
  'person_followed',
] as const;

export type BetaEventType = (typeof betaEventTypes)[number];

/**
 * Records an authenticated beta action. The database only accepts events from
 * members of the invite-only cohort, so normal visitors never enter the report.
 */
export async function recordBetaEvent(eventType: BetaEventType): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.rpc('record_beta_event', { event_type: eventType });
  if (error) throw error;
}

export async function recordBetaEventBestEffort(eventType: BetaEventType): Promise<void> {
  try {
    await recordBetaEvent(eventType);
  } catch {
    // Analytics must not interrupt a person's Morrow flow.
  }
}

import { supabase } from './supabase';

/**
 * Records an authenticated beta action. The database only accepts events from
 * members of the invite-only cohort, so normal visitors never enter the report.
 */
export async function recordBetaEvent(eventType: string): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.rpc('record_beta_event', { event_type: eventType });
  if (error) throw error;
}

export async function recordBetaEventBestEffort(eventType: string): Promise<void> {
  try {
    await recordBetaEvent(eventType);
  } catch {
    // Analytics must not interrupt a person's Morrow flow.
  }
}

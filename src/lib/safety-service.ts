import { supabase, supabaseConfigurationError } from './supabase';

type BlockRow = { blocker_id: string; blocked_id: string };
type ReportTarget = { target_profile_id: string } | { target_experience_id: string };

async function verifyAccount(userId: string) {
  if (!supabase) throw new Error(supabaseConfigurationError);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (user?.id !== userId) throw new Error('Could not verify your Morrow account.');
}

function reportReason(reason: string): string {
  const trimmedReason = reason.trim();
  if (!trimmedReason) throw new Error('Tell us briefly what happened before sending a report.');
  return trimmedReason;
}

async function submitReport(userId: string, target: ReportTarget, reason: string): Promise<void> {
  await verifyAccount(userId);
  const { error } = await supabase!.from('reports').insert({
    reporter_id: userId,
    ...target,
    reason: reportReason(reason),
  });
  if (error) throw error;
}

export async function loadBlockedPersonIds(userId: string): Promise<Set<string>> {
  await verifyAccount(userId);
  const { data, error } = await supabase!.from('blocks')
    .select('blocker_id, blocked_id')
    .or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`);
  if (error) throw error;
  return new Set((data as BlockRow[] ?? []).map((block) => (
    block.blocker_id === userId ? block.blocked_id : block.blocker_id
  )));
}

export async function blockPerson(userId: string, personId: string): Promise<void> {
  await verifyAccount(userId);
  if (userId === personId) throw new Error('You cannot block your own profile.');
  const { error } = await supabase!.rpc('block_person', { person_id: personId });
  if (error) throw error;
}

export async function reportProfile(userId: string, profileId: string, reason: string): Promise<void> {
  if (userId === profileId) throw new Error('You cannot report your own profile.');
  await submitReport(userId, { target_profile_id: profileId }, reason);
}

export async function reportExperience(userId: string, experienceId: string, reason: string): Promise<void> {
  await submitReport(userId, { target_experience_id: experienceId }, reason);
}

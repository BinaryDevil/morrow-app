export const bootScreenMinimumDurationMs = 700;
export const bootScreenName = 'Morrow';
export const bootScreenSlogan = 'Find your next favorite experience';

export function waitForBootScreen(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, bootScreenMinimumDurationMs));
}

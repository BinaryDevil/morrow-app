export const bootScreenMinimumDurationMs = 700;

export function waitForBootScreen(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, bootScreenMinimumDurationMs));
}

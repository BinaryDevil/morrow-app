import { bootScreenMinimumDurationMs, bootScreenName, bootScreenSlogan, waitForBootScreen } from '../boot-screen';

describe('app boot screen', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('remains visible long enough to be seen when startup completes immediately', async () => {
    let completed = false;
    const boot = waitForBootScreen().then(() => { completed = true; });

    await jest.advanceTimersByTimeAsync(bootScreenMinimumDurationMs - 1);
    expect(completed).toBe(false);

    await jest.advanceTimersByTimeAsync(1);
    await boot;
    expect(completed).toBe(true);
  });

  it('identifies Morrow and its promise while the app opens', () => {
    expect(bootScreenName).toBe('Morrow');
    expect(bootScreenSlogan).toBe('Find your next favorite experience');
  });
});

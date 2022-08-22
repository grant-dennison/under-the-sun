import { getGlobalState } from "./global-state";
import { finish } from "./test-reporter";

export interface TestScheduler {
  /** Schedule a task to run. When all tasks have finished running, it should call {@link finish}. */
  schedule: (description: string, run: () => PromiseLike<void>) => void;
}

/** Set the global test scheduler. */
export function setTestScheduler(scheduler: TestScheduler): void {
  getGlobalState().scheduler = scheduler;
}

/** Schedule a task to run.
 * When all tasks are completed (assuming at least one scheduled),
 * the reporter will be notified of finish. */
export function schedule(
  description: string,
  run: () => PromiseLike<void>
): void {
  getGlobalState().scheduler.schedule(description, run);
}

interface TestRun {
  description: string;
  promise: PromiseLike<void>;
}

export function makeDefaultTestRunner(): TestScheduler {
  async function watchTestsForFinish() {
    for (let i = 0; i < testRuns.length; i++) {
      await testRuns[i].promise;
    }
    finish();
  }

  let someoneIsWatching = false;
  const testRuns: TestRun[] = [];

  return {
    schedule(description, run) {
      testRuns.push({ description, promise: run() });

      if (!someoneIsWatching) {
        void watchTestsForFinish();
        someoneIsWatching = true;
      }
    },
  };
}

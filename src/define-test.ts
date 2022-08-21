import { performance } from "perf_hooks";
import { finish, reportFailure, reportSuccess } from "./test-reporter";

/** Register a test to run. */
export function test(
  description: string,
  exercise: () => void | PromiseLike<void>
): void {
  const run = async () => {
    const start = performance.now();
    try {
      await exercise();
      await reportSuccess(description, performance.now() - start);
    } catch (e) {
      await reportFailure(description, e, performance.now() - start);
    }
  };
  testRuns.push({ description, promise: run() });

  if (!someoneIsWatching) {
    watchTestsForFinish();
    someoneIsWatching = true;
  }
}

/**
 * Don't let test results be gathered until the promise is fulfilled.
 * @param exercise What to do while stalling final test results. **SHOULD NOT THROW**
 */
export function stallTestCompletion(exercise: () => PromiseLike<void>): void {
  testRuns.push({ description: "stall", promise: exercise() });
}

interface TestRun {
  description: string;
  promise: PromiseLike<void>;
}

async function watchTestsForFinish() {
  for (let i = 0; i < testRuns.length; i++) {
    await testRuns[i].promise;
  }
  finish();
}

let someoneIsWatching = false;
const testRuns: TestRun[] = [];

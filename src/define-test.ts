import { performance } from "perf_hooks";
import { reportFailure, reportSuccess } from "./test-reporter";
import { schedule } from "./test-scheduler";

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
  schedule(description, run);
}

/**
 * Don't let test results be gathered until the promise is fulfilled.
 *
 * This function is appropriate to call if you are asynchronously generating test cases.
 *
 * @param exercise What to do while stalling final test results. **SHOULD NOT THROW**
 */
export function stallTestCompletion(exercise: () => PromiseLike<void>): void {
  schedule("stall", exercise);
}

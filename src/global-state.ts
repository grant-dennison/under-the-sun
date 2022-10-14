import { makeDefaultTestReporter } from "./reporter/default-test-reporter";
import type { TestDefinition, TestResult } from "./define-test";
import type { TestReporter } from "./reporter/test-reporter";
import { makeDefaultTestScheduler, TestScheduler } from "./scheduler/test-scheduler";

const where = (global ??
  // @ts-expect-error window is just fallback
  window ??
  // Fallback to local object.
  {}) as Record<symbol, GlobalState | undefined>;

const symbol = Symbol.for("__UNDER_THE_SUN_STATE__");

export interface GlobalState {
  testsRunning: PromiseLike<TestResult>[] | null;
  reporter: TestReporter;
  scheduler: TestScheduler;
  filterByDescription: RegExp;
}

let cachedState: GlobalState | undefined = undefined;
export function getGlobalState(): GlobalState {
  if (cachedState) {
    return cachedState;
  }
  if (!where[symbol]) {
    where[symbol] = {
      testsRunning: null,
      reporter: makeDefaultTestReporter(),
      scheduler: makeDefaultTestScheduler(),
      filterByDescription: /.*/,
    };
  }
  cachedState = where[symbol];
  return cachedState;
}

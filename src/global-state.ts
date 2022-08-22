import { makeDefaultTestReporter } from "./default-test-reporter";
import type { TestReporter } from "./test-reporter";
import { makeDefaultTestRunner, TestScheduler } from "./test-scheduler";

const where = (global ??
  // @ts-expect-error window is just fallback
  window ??
  // Fallback to local object.
  {}) as Record<symbol, GlobalState | undefined>;

const symbol = Symbol.for("__UNDER_THE_SUN_STATE__");

export interface GlobalState {
  reporter: TestReporter;
  scheduler: TestScheduler;
}

let cachedState: GlobalState | undefined = undefined;
export function getGlobalState(): GlobalState {
  if (cachedState) {
    return cachedState;
  }
  if (!where[symbol]) {
    where[symbol] = {
      reporter: makeDefaultTestReporter(),
      scheduler: makeDefaultTestRunner(),
    };
  }
  cachedState = where[symbol];
  return cachedState;
}

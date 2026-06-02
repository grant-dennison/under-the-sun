import type { TestDefinition, TestResult } from "../define-test"
import { globalOptions } from "../state/options"
import { makeConcurrentTestScheduler } from "./concurrent-test-scheduler"
import { makeSerialTestScheduler } from "./serial-test-scheduler"

export interface TestScheduler {
  /** Schedule a task to run. */
  schedule: (testDefinition: TestDefinition) => PromiseLike<TestResult>
}

/** Set the global test scheduler. */
export function setTestScheduler(scheduler: TestScheduler): void {
  globalOptions.customTestScheduler = scheduler
}

export function makeDefaultTestScheduler() {
  if (globalOptions.serial) {
    return makeSerialTestScheduler()
  }
  return makeConcurrentTestScheduler()
}

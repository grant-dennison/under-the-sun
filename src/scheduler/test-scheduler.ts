import type { TestDefinition, TestResult } from "../define-test"
import { getGlobalState } from "../global-state"
import { assertTestsNotRunning } from "../run-tests"
import { makeParallelTestScheduler } from "./parallel-test-scheduler"

export interface TestScheduler {
  /** Schedule a task to run. */
  schedule: (testDefinition: TestDefinition) => PromiseLike<TestResult>
}

/** Set the global test scheduler. */
export function setTestScheduler(scheduler: TestScheduler): void {
  assertTestsNotRunning(
    "Scheduler should not be set in the middle of a test run"
  )
  getGlobalState().scheduler = scheduler
}

export const makeDefaultTestScheduler = makeParallelTestScheduler

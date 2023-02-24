import assert from "node:assert";
import type { TestDefinition } from "./define-test";
import { getGlobalState } from "./global-state";

export async function runTests(gatherTests: () => PromiseLike<void>) {
  assertTestsNotRunning("runTests() should not be called while another test run is in progress")
  const state = getGlobalState()
  try {
    state.reporter.reportStart?.()
    state.testsRunning = []
    await gatherTests()
    const results = await Promise.allSettled(state.testsRunning)
    return !results.some(r => r.status === "rejected" || r.value.error !== null)
  } finally {
    state.testsRunning = null
    state.reporter.reportFinish?.()
  }
}

export function submitTest(test: TestDefinition): void {
  const state = getGlobalState()
  if (state.testsRunning !== null && state.filterByDescription.test(test.description)) {
    state.testsRunning.push(state.scheduler.schedule(test))
  }
}

export function assertTestsNotRunning(message: string): void {
  assert.strictEqual(getGlobalState().testsRunning, null, message)
}

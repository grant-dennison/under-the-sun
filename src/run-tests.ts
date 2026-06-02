import type { TestDefinition } from "./define-test"
import { autoScheduleFinalReport } from "./finalize"
import { getGlobalState } from "./state/state"

export function submitTest(test: TestDefinition): void {
  const state = getGlobalState()
  if (
    state.testsRunning !== null &&
    state.filterByDescription.test(test.description)
  ) {
    state.testsRunning.push(state.scheduler.schedule(test))
  }
  autoScheduleFinalReport()
}

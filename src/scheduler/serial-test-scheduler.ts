import type { TestResult } from "../define-test"
import type { TestScheduler } from "./test-scheduler"

export function makeSerialTestScheduler(): TestScheduler {
  let lastTestPromise: PromiseLike<TestResult> = Promise.resolve({
    runtimeMs: 0,
    error: null,
  })

  return {
    schedule(definition) {
      lastTestPromise = lastTestPromise.then(async () => definition.run())
      return lastTestPromise
    },
  }
}

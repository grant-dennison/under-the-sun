import type { TestResult } from "./define-test"
import { getGlobalState } from "./state/state"

function waitTick() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1)
  })
}

async function waitForTestsNoAggregate() {
  await waitTick()
  const state = getGlobalState()
  let results: PromiseSettledResult<TestResult | null>[] = []
  while (results.length < state.testsRunning.length) {
    results = await Promise.allSettled(state.testsRunning)
  }
  return results
}

async function waitForTests() {
  const results = await waitForTestsNoAggregate()
  return !results.some((r) => r.status === "rejected" || r.value?.error)
}

async function waitForTestsAndReport() {
  const state = getGlobalState()
  state.finalReportScheduled = true
  try {
    return await waitForTests()
  } finally {
    state.reporter.reportFinish?.()
  }
}

export function autoScheduleFinalReport() {
  const state = getGlobalState()
  if (!state.finalReportScheduled) {
    waitForTestsAndReport().then(
      (success) => {
        process.exit(success ? 0 : 1)
      },
      (e) => {
        console.error(e)
      }
    )
  }
}

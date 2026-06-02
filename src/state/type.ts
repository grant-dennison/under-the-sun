import type { TestResult } from "../define-test"
import type { TestReporter } from "../reporter/test-reporter"
import type { TestScheduler } from "../scheduler/test-scheduler"

export type GlobalSingleton = {
  options?: GlobalOptions
  state?: GlobalState
}

export type GlobalOptions = {
  magicGlobals?: boolean
  serial?: boolean
  customTestReporter?: TestReporter
  customTestScheduler?: TestScheduler
}

export type GlobalState = {
  testsRunning: PromiseLike<TestResult | null>[]
  reporter: TestReporter
  finalReportScheduled: boolean
  scheduler: TestScheduler
  filterByDescription: RegExp
}

import { globalOptions } from "state/options"
import type { TestResult } from "../define-test"

export interface TestReporter {
  /** Handle test result. **SHOULD NOT THROW** */
  reportResult: (
    testDescription: string,
    testResult: TestResult
  ) => void | PromiseLike<void>
  /** This method is run when all tests have finished. */
  reportFinish?: () => void
}

/** Configure the test reporter (if you don't like the default). */
export function setTestReporter(reporter: TestReporter): void {
  globalOptions.customTestReporter = reporter
}

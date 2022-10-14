import type { TestResult } from "../define-test";
import { getGlobalState } from "../global-state";
import { assertTestsNotRunning } from "../run-tests";

export interface TestReporter {
  /** Handle test result. **SHOULD NOT THROW** */
  reportResult: (
    testDescription: string,
    testResult: TestResult
  ) => void | PromiseLike<void>;
  /** This method is run when test run is started. */
  reportStart?: () => void;
  /** This method is run when all tests have finished. */
  reportFinish?: () => void;
}

/** Configure the test reporter (if you don't like the default). */
export function setTestReporter(reporter: TestReporter): void {
  assertTestsNotRunning("Reporter should not be set in the middle of a test run")
  getGlobalState().reporter = reporter;
}

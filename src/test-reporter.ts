import { getGlobalState } from "./global-state";

export interface TestReporter {
  /** Handle test success. **SHOULD NOT THROW** */
  reportSuccess: (
    testDescription: string,
    runtimeMs: number
  ) => void | PromiseLike<void>;
  /** Handle test failure (exception thrown). **SHOULD NOT THROW** */
  reportFailure: (
    testDescription: string,
    error: unknown,
    runtimeMs: number
  ) => void | PromiseLike<void>;
  /** This method is run when all tests have finished. It probably should call `process.exit()` (and not throw). */
  finish: () => void;
}

/** Configure the test reporter (if you don't like the default). */
export function setTestReporter(reporter: TestReporter): void {
  getGlobalState().reporter = reporter;
}

export const reportSuccess: TestReporter["reportSuccess"] = (
  testDescription,
  runtimeMs
) => {
  return getGlobalState().reporter.reportSuccess(testDescription, runtimeMs);
};
export const reportFailure: TestReporter["reportFailure"] = (
  testDescription,
  error,
  runtimeMs
) => {
  return getGlobalState().reporter.reportFailure(
    testDescription,
    error,
    runtimeMs
  );
};
export const finish: TestReporter["finish"] = () => {
  return getGlobalState().reporter.finish();
};

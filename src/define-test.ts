import { performance } from "node:perf_hooks"
import { getGlobalState } from "./global-state"
import { submitTest } from "./run-tests"
import { catchError } from "./utils/error"

export type TestDefinition = {
  description: string
  /** Execute the test logic. DOES NOT THROW. */
  run: () => PromiseLike<TestResult>
}

export type TestResult = {
  runtimeMs: number
  /** If the test failed, error will not be null. */
  error: Error | null
}

/** Register a test to run. */
export function test(
  description: string,
  exercise: () => void | PromiseLike<void>
): void {
  const run = async (): Promise<TestResult> => {
    const start = performance.now()
    const error = await catchError(exercise)
    const runtimeMs = performance.now() - start
    const result = { runtimeMs, error }
    await getGlobalState().reporter.reportResult(description, result)
    return result
  }
  submitTest({ description, run })
}

/**
 * Create shorthand function for defining tests in a group.
 *
 * This is really just a wrapper around {@link test} that applies a common prefix string.
 */
export function defineTestGroup(groupDescriptionPrefix: string): typeof test {
  return (description, exercise) =>
    test(groupDescriptionPrefix + description, exercise)
}

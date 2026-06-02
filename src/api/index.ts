import { configureMagicGlobals } from "magic-global"
import { globalOptions } from "state/options"

export { defineTestGroup, test } from "../define-test"
export type { TestResult } from "../define-test"
export { setTestReporter } from "../reporter/test-reporter"
export type { TestReporter } from "../reporter/test-reporter"

if (globalOptions.magicGlobals) {
  configureMagicGlobals()
}

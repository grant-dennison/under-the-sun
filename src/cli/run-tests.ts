import { configureMagicGlobals } from "magic-global"
import { walkFilteredFiles } from "../filtered-files"
import { makeSerialTestScheduler } from "../scheduler/serial-test-scheduler"
import { setTestScheduler } from "../scheduler/test-scheduler"
import { getGlobalState } from "../state/state"
import { ensureError } from "../utils/error"
import { dynamicImport } from "./dynamic-import"
import type { CliArgs } from "./parse-cli-args"
import { loadRequiredModules } from "./required-modules"

function configure(args: CliArgs) {
  getGlobalState().filterByDescription = args.testDescriptionRegex
  if (args.serial) {
    setTestScheduler(makeSerialTestScheduler())
  }
  if (args.magicGlobals) {
    configureMagicGlobals()
  }
}

export async function runTests(args: CliArgs) {
  await loadRequiredModules(args.modulesToLoad)
  configure(args)
  await walkFilteredFiles(args, async (f) => {
    try {
      const importPromise = dynamicImport(f, true).then(() => null)
      getGlobalState().testsRunning.push(importPromise)
      await importPromise
    } catch (e) {
      await getGlobalState().reporter.reportResult(f, {
        runtimeMs: 0,
        error: ensureError(e),
      })
    }
  })
}

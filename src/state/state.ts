import { makeDefaultTestReporter } from "../reporter/default-test-reporter"
import { makeDefaultTestScheduler } from "../scheduler/test-scheduler"
import { globalSingleton } from "./global"
import { globalOptions } from "./options"
import type { GlobalState } from "./type"

function makeDefaultState(): GlobalState {
  return {
    testsRunning: [],
    reporter: globalOptions.customTestReporter ?? makeDefaultTestReporter(),
    finalReportScheduled: false,
    scheduler: globalOptions.customTestScheduler ?? makeDefaultTestScheduler(),
    filterByDescription: /.*/,
  }
}

let state: GlobalState | undefined = undefined
export function getGlobalState(): GlobalState {
  if (!state) {
    state = globalSingleton.state = makeDefaultState()
  }
  return state
}

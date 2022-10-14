import { performance } from "perf_hooks";
import type { TestReporter } from "./test-reporter";

export function makeDefaultTestReporter(): TestReporter {
  let start = performance.now();
  let testsPassed = 0;
  let testsFailed = 0;
  return {
    reportStart() {
      start = performance.now()
    },
    reportResult(testDescription, result) {
      if (!result.error) {
        testsPassed++;
        return
      }

      testsFailed++;
      redError("FAIL: " + testDescription);
      console.error(result.error.stack ?? result.error.message)
      console.error();
    },
    reportFinish() {
      const total = testsPassed + testsFailed;
      const runtimeMs = performance.now() - start;
      const resultMessage = `${testsPassed}/${total} tests passed` + ` (${Math.ceil(runtimeMs)}ms)`;
      const print = testsFailed > 0 ? redError : greenInfo
      print(resultMessage)
    },
  };
}

function redError(message: string) {
  console.error("\x1b[31m%s\x1b[0m", message);
}
function greenInfo(message: string) {
  console.info("\x1b[32m%s\x1b[0m", message);
}

import { performance } from "perf_hooks";
import type { TestReporter } from "./test-reporter";

export function makeDefaultTestReporter(): TestReporter {
  const start = performance.now();
  let testsPassed = 0;
  let testsFailed = 0;
  return {
    reportSuccess() {
      testsPassed++;
    },
    reportFailure(testDescription, error) {
      testsFailed++;
      redError("FAIL: " + testDescription);
      if (error instanceof Error) {
        console.error(error.stack ?? error.message);
      } else {
        console.error(error);
      }
      console.error();
    },
    finish() {
      const total = testsPassed + testsFailed;
      const runtimeMs = performance.now() - start;
      const resultMessage = `${
        total - testsFailed
      }/${total} tests passed (${Math.ceil(runtimeMs)}ms)`;
      if (testsFailed > 0) {
        redError(resultMessage);
        process.exit(1);
      } else {
        greenInfo(resultMessage);
        process.exit(0);
      }
    },
  };
}

function redError(message: string) {
  console.error("\x1b[31m%s\x1b[0m", message);
}
function greenInfo(message: string) {
  console.info("\x1b[32m%s\x1b[0m", message);
}

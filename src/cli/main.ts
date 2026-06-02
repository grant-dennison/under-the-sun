#!/usr/bin/env node

import { parseCliArgs } from "./parse-cli-args"
import { printImports } from "./print-imports"
import { runAsync } from "./run-async"
import { runTests } from "./run-tests"

runAsync(async () => {
  const args = parseCliArgs(process.argv)

  if (args.mode === "imports") {
    await printImports(args)
    return
  }

  await runTests(args)
})

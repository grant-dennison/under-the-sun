#!/usr/bin/env node

import path from "node:path";
import { walkFiles } from "src/walk-files";
import { defineTestGroup, test } from "../define-test";
import { getGlobalState } from "../global-state";
import { runTests } from "../run-tests";
import { ensureError } from "../utils/error";
import { requireThenImport } from "./import-or-require";
import { parseCliArgs } from "./parse-cli-args";
import { runAsync } from "./run-async";
const state = getGlobalState()

const args = parseCliArgs(process.argv);
const relativeMe = path.relative(__dirname, process.cwd()).replace(/\\/g, "/");

async function loadRequiredModules() {
  for (const m of args.modulesToLoad) {
    if (/^\.{1,2}\//.test(m)) {
      await requireThenImport(path.posix.join(relativeMe, m));
    } else {
      await requireThenImport(m);
    }
  }
}

async function configure() {
  state.filterByDescription = args.testDescriptionRegex
  if (args.magicGlobal) {
    const g = global as Record<string, unknown>
    g.test = test;
    g.defineTestGroup = defineTestGroup
  }
}

function shouldIncludeFile(f: string): boolean {
  return args.testFilePathRegex1.test(f) || args.testFilePathRegex2.test(f)
}

runAsync(async () => {
  await loadRequiredModules()
  await configure()
  const success = await runTests(() => walkFiles({
    dir: args.dir,
    ignorePattern: args.ignoreRegex,
  }, async (f) => {
    if (!shouldIncludeFile(f)) {
      return
    }
    try {
      await requireThenImport(path.posix.join(relativeMe, f))
    } catch (e) {
      await getGlobalState().reporter.reportResult(f, {
        runtimeMs: 0,
        error: ensureError(e)
      })
    }
  }))
  process.exit(success ? 0 : 1)
})
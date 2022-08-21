#!/usr/bin/env node

import path from "path";
import { stallTestCompletion } from "./define-test";
import { forEachTestFile } from "./gather-tests";
import { importOrRequire, requireThenImport } from "./import-or-require";
import { parseCliArgs } from "./parse-cli-args";
import { reportFailure } from "./test-reporter";

const args = parseCliArgs(process.argv);

const relativeMe = path.relative(__dirname, process.cwd()).replace(/\\/g, "/");

for (const m of args.modulesToLoad) {
  console.log("loading module " + m);
  if (/^\.{1,2}\//.test(m)) {
    requireThenImport(path.posix.join(relativeMe, m));
  } else {
    requireThenImport(m);
  }
}

stallTestCompletion(() =>
  forEachTestFile(args.dir, args.testFilePathRegex, async (f) => {
    try {
      requireThenImport(path.posix.join(relativeMe, f));
    } catch (e) {
      reportFailure(f, e, 0);
    }
  })
);

#!/usr/bin/env node

import path from "path";
import { forEachTestFile, reportFailure, stallTestCompletion, test } from "..";
import { requireThenImport } from "./import-or-require";
import { parseCliArgs } from "./parse-cli-args";

const args = parseCliArgs(process.argv);

const relativeMe = path.relative(__dirname, process.cwd()).replace(/\\/g, "/");

stallTestCompletion(async () => {
  for (const m of args.modulesToLoad) {
    if (/^\.{1,2}\//.test(m)) {
      await requireThenImport(path.posix.join(relativeMe, m));
    } else {
      await requireThenImport(m);
    }
  }

  if (args.magicGlobal) {
    (global as Record<string, unknown>).test = test;
  }

  await forEachTestFile(args.dir, args.testFilePathRegex, async (f) => {
    try {
      await requireThenImport(path.posix.join(relativeMe, f));
    } catch (e) {
      await reportFailure(f, e, 0);
    }
  });
});

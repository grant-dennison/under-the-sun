// This idea was taken from uvu: https://github.com/lukeed/uvu/blob/56e1cb25ecd76cbf5cd3fd28c7a4c07db405c5c3/bin.js

import path from "node:path"
import { cliToCwdPath } from "./cli-to-cwd-path"

export async function dynamicImport(m: string, relative = true) {
  return dynamicImportRaw(getImportPath(m, relative))
}

function getImportPath(m: string, relative: boolean) {
  if (relative) {
    return path.posix.join(cliToCwdPath, m)
  }
  return m
}

async function dynamicImportRaw(m: string) {
  try {
    require(m)
  } catch (e) {
    if (
      e instanceof Error &&
      (e as unknown as Record<string, unknown>).code === "ERR_REQUIRE_ESM"
    ) {
      await dynamicImportNative(m)
    } else {
      throw e
    }
  }
}

const dynamicImportNative = (x: string) =>
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  new Function(`return import(${JSON.stringify(x)})`).call(
    0
  ) as PromiseLike<unknown>

import { walkFiles } from "./walk-files"

export type TestFileArgs = {
  dir: string
  testFilePathRegex1: RegExp
  testFilePathRegex2: RegExp
  ignoreRegex: RegExp
}

export async function walkFilteredFiles(
  args: TestFileArgs,
  handleFile: (file: string) => PromiseLike<void> | void
) {
  function shouldIncludeFile(f: string): boolean {
    return args.testFilePathRegex1.test(f) && args.testFilePathRegex2.test(f)
  }
  await walkFiles(
    {
      dir: args.dir,
      ignorePattern: args.ignoreRegex,
    },
    async (f) => {
      if (!shouldIncludeFile(f)) {
        return
      }
      await handleFile(f)
    }
  )
}

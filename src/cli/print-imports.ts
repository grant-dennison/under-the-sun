import { walkFilteredFiles } from "../filtered-files"
import type { CliArgs } from "./parse-cli-args"

export async function printImports(args: CliArgs) {
  function getImportPath(f: string, relative: boolean) {
    if (relative) {
      return `${args.importBase}/${f}`
    }
    return f
  }

  function getImport(f: string, relative = true) {
    return `import "${getImportPath(f, relative)}"`
  }

  const files: string[] = []
  for (const m of args.modulesToLoad) {
    console.log(getImport(m, /^\.{1,2}\//.test(m)))
  }
  if (args.magicGlobals) {
    console.log(`import "under-the-sun/configure/magic-globals"`)
    // This separated second import keeps the distributed size of configure/magic-globals from ballooning.
    console.log(`import "under-the-sun"`)
  }
  if (args.serial) {
    console.log(`import "under-the-sun/configure/serial-scheduler"`)
  }
  await walkFilteredFiles(args, (f) => {
    files.push(f)
  })
  console.log(
    files
      .sort((a, b) => a.localeCompare(b))
      .map((f) => getImport(f))
      .join("\n")
  )
}

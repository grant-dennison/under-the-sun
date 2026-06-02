import { dynamicImport } from "./dynamic-import"

export async function loadRequiredModules(modulesToLoad: readonly string[]) {
  for (const m of modulesToLoad) {
    await dynamicImport(m, /^\.{1,2}\//.test(m))
  }
}

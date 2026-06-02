import { defineTestGroup, test } from "./define-test"

export function configureMagicGlobals() {
  const g = global as Record<string, unknown>
  g.test = test
  g.defineTestGroup = defineTestGroup
}

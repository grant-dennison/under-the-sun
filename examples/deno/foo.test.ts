import assert from "node:assert"
import { test } from "under-the-sun"
import { foo } from "./foo.ts"

test("foo() > returns 2", () => {
  assert.strictEqual(foo(), 2)
})

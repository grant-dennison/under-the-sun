import assert from "node:assert"
import { test } from "under-the-sun"
import { foo } from "./foo.mjs"

test("foo() > returns 3", () => {
  assert.strictEqual(foo(), 3)
})

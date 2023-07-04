const assert = require("assert")
const { test } = require("under-the-sun")
const { foo } = require("./foo")

test("foo() > returns 2", () => {
  assert.strictEqual(foo(), 2)
})

test("foo() > returns 3", () => {
  assert.strictEqual(foo(), 3)
})

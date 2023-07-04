const assert = require("assert")
const { test } = require("under-the-sun")

test("not run", () => {
  assert.fail("should not be run")
})

const { expect } = require("expect")
const { test } = require("under-the-sun")
const { foo } = require("./foo")

test("foo() > returns 2", () => {
  expect(foo()).toBe(2)
})

test("foo() > returns 3", () => {
  expect(foo()).toBe(3)
})

import assert from "assert";
import { test } from "under-the-sun";
import { foo } from "./foo";

test("foo() > returns 2", () => {
  assert.strictEqual(foo(), 2);
});

test("foo() > returns 3", () => {
  assert.strictEqual(foo(), 3);
});

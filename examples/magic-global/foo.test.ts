import assert from "node:assert";
import { foo } from "./foo";

// Notice that `test` is not imported.

test("foo() > returns 2", () => {
  assert.strictEqual(foo(), 2);
});

test("foo() > returns 3", () => {
  assert.strictEqual(foo(), 3);
});

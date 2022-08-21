const assert = require("assert");
const { test } = require("under-the-sun");
const { foo } = require("./foo");

test("read file > good", async () => {
  const contents = await foo();
  assert.strictEqual(contents, "bar");
});

test("read file > bad", async () => {
  const contents = await foo();
  assert.strictEqual(contents, "baz");
});

// In practice, you might not initialize tests often in a loop like this (though you could!).
// This is just demonstrating that long-running tests aren't necessarily additive in total test runtime
// unlike some competitors (looking at you uvu).
for (let i = 0; i < 100; i++) {
  test(`Artificially long test ${i}`, async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    assert.notStrictEqual(i, 42, "It is not the answer");
  });
}

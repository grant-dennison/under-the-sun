# Under the Sun

A nothing-new-under-the-sun testing framework.

This testing framework was inspired by the likes of [uvu](https://github.com/lukeed/uvu).
It is intended to be as _**fast**_ as possible yet as _**simple**_ as possible.

## Installation

```
npm install --save-dev under-the-sun
```

## Usage

```js
// examples/my.test.js
import assert from "assert";
import { test } from "under-the-sun";

test("something synchronous", () => {
  assert(2 === 2, "2 should be 2");
});

test("something asynchronous", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  assert(2 === 3, "2 should still be...2");
});
```

Either execute this file directly:

```
node my.test.js
```

Or let under-the-sun CLI find all the tests for you:

```
npx under-the-sun examples
# or aliases
npx uts examples
```

## Output

If you're unsatisfied with the default test reporter, you can override it.

```js
// examples/test-reporter.js
import { setTestReporter } from "under-the-sun";

let failure = false;
setTestReporter({
  reportSuccess(testDescription) {
    // Do something about test success.
  },
  reportFailure(testDescription, error) {
    // Do something about test failure.
    failure = true;
    console.error("FAIL: " + testDescription);
  },
  finish() {
    // Finalize the test run.
    process.exit(failure ? 1 : 0);
  },
});
```

Then just load this file alongside your tests:

```
uts -r examples/test-reporter.js examples
```

You can check out the [default implementation](src/default-test-reporter.ts) for ideas.

## CLI

The CLI is available via `under-the-sun` or `uts`.

```
uts [options] [dir] [pattern]
```

Tests will be discovered automatically within the `dir` directory matching the `pattern` regex.

- `dir` is the current directory by default.
- `pattern` is `/\.test\.(j|t)s$/` [by default](src/parse-cli-args.ts#4)

The `pattern` CLI argument is passed directly to `new RegExp(<pattern>, 'i')`.

## API

The library exposes a items for programmatic usage, but it's a small enough surface area it will just be easier for you to [check them out](src/index.ts) on your own.

## Examples

See the [examples/](examples) directory for specific working examples.

## Why should I use this?

You probably don't want to.
That being said, here are some aims of this library:

- **Fast** - This library pretty much just runs your JavaScript with as much `async` as possible. There's nothing fancy that could possibly slow things down. The only way make it _meaningfully_ faster would be to use some alternative runtime (e.g. native code, process-level multithreading, caching).
- **Simple** - This library doesn't provide a large API, so you're not tightly coupling your code to it in a way you can't easily change later.

I think this testing library is best for **pure JavaScript/TypeScript Node.js libraries**.

It's entirely possible someone has already written a library that does exactly what this does, better and with more features.
I didn't find it though.

### Why Not [uvu](https://github.com/lukeed/uvu)?

> You said this is like uvu. Why not just use that?

uvu [doesn't](https://github.com/lukeed/uvu/issues/14) do any kind of parallelization.

This library is still single-threaded, but it leverages the asynchronous concurrency built into JavaScript.
This strategy is particularly helpful when you have a lot of tests with a significant I/O-bound component.

### Why Not [Jest](https://jestjs.io)?

> You reference Jest's assertion library. Why not use it wholesale?

Jest is slow. It's pretty great to work with, but my experience has shown that it takes multiple seconds to run basic tests.

### Why Not [Vitest](https://vitest.dev)?

Vitest is focused on the web application ecosystem, not so much the Node library ecosystem.

### Why Not [AVA](https://github.com/avajs/ava)?

AVA has [fallen out of favor](https://2021.stateofjs.com/en-US/libraries/testing), and I didn't want to waste time figuring out why.
I'm guessing it has something to do with the opinionated-ness of it.
Also, uvu's author claims that uvu is faster.

### Why Not [Mocha](https://mochajs.org)?

Mocha has also [fallen out of favor](https://2021.stateofjs.com/en-US/libraries/testing).
I've never used it, so maybe it's completely superior. ¯\\_(ツ)_/¯

### Why Not [Tape](https://github.com/substack/tape)?

Also never used it.

## TypeScript

If you're using TypeScript, you may want to run your tests with some kind of TypeScript module loader like [esbuild-register](https://www.npmjs.com/package/esbuild-register), [@swc-node/register](https://www.npmjs.com/package/@swc-node/register), or [ts-node](https://www.npmjs.com/package/ts-node).

```
under-the-sun -r esbuild-register examples
under-the-sun -r @swc-node/register examples
under-the-sun -r ts-node/register
```

## Assertions

This library does not ship with any assertions. You'll have to find your own.

Here are some options for you:

### Node's `assert` Module

Node's [assert module](https://nodejs.org/api/assert.html) comes with Node out of the box, so you don't have to install anything.
It has a little bit of flexibility, but the reporting may not be as nice as you're used to.

```js
import assert from "assert";

test("...", async () => {
  assert(2 === 2, "2 should be 2");
  assert.strictEqual(2, 3, "2 should still be 2");
  assert.deepStrictEqual({}, {}, "More complex equality");
});
```

### Jest's `expect` Library

If you're coming from [Jest](https://jestjs.io), you may feel most comfortable picking up it's [expect library](https://www.npmjs.com/package/expect).

```js
import { expect } from "expect";

test("...", async () => {
  expect(2).toBe(2);
  expect({}).toStrictEqual({});
});
```

### Chai

For a more traditional JS approach, you may want to use [Chai](https://github.com/chaijs/chai).

```js
import { assert } from "chai";

test("...", async () => {
  assert.equal(2, 3, "2 should still be 2");
});
```

## Watching

To run tests in watch mode, follow a strategy [like uvu's](https://github.com/lukeed/uvu/tree/master/examples/watch).

```json
{
  "scripts": {
    "test:watch": "watchlist src -- uts examples"
  },
  "devDependencies": {
    "under-the-sun": "^1.0.0",
    "watchlist": "^0.2.1"
  }
}
```

/** Register a test to run. */
declare const test: (
  description: string,
  exercise: () => void | PromiseLike<void>
) => void

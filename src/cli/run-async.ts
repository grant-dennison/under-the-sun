export function runAsync(exercise: () => PromiseLike<void>) {
  exercise().then(
    () => {
      // Do nothing.
    },
    (e) => {
      console.error(e)
      process.exit(1)
    }
  )
}

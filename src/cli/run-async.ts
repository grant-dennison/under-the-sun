export function runAsync(exercise: () => PromiseLike<void>) {
  exercise().then(
    () => {
      process.exit(0)
    },
    (e) => {
      console.error(e)
      process.exit(1)
    }
  )
}

export function ensureError(e: unknown): Error {
  if (e instanceof Error) {
    return e
  }
  return new Error(JSON.stringify(e))
}

export async function catchError(
  run: () => void | PromiseLike<void>
): Promise<Error | null> {
  try {
    await run()
    return null
  } catch (e) {
    return ensureError(e)
  }
}

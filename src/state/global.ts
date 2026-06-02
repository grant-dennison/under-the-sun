import type { GlobalSingleton } from "./type"

const where = (global ??
  // @ts-expect-error window is just fallback
  window ??
  // Fallback to local object.
  {}) as Record<symbol, GlobalSingleton | undefined>

const symbol = Symbol.for("__UTS_G__")

export const globalSingleton: GlobalSingleton = (where[symbol] =
  where[symbol] ?? {})

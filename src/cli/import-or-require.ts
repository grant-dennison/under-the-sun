// This idea was taken from uvu: https://github.com/lukeed/uvu/blob/56e1cb25ecd76cbf5cd3fd28c7a4c07db405c5c3/bin.js

const dimport = (x: string) =>
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  new Function(`return import(${JSON.stringify(x)})`).call(
    0
  ) as PromiseLike<unknown>

export async function requireThenImport(m: string) {
  try {
    require(m)
  } catch (e) {
    if (
      e instanceof Error &&
      (e as unknown as Record<string, unknown>).code === "ERR_REQUIRE_ESM"
    ) {
      await dimport(m)
    } else {
      throw e
    }
  }
}

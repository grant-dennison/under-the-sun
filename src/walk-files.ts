import fs from "node:fs/promises"
import path from "node:path"

type WalkOptions = {
  dir: string
  ignorePattern: RegExp
}

export async function walkFiles(
  { dir, ignorePattern }: WalkOptions,
  handler: (filePath: string) => PromiseLike<void>
) {
  const files = await fs.readdir(dir, { withFileTypes: true })
  await Promise.allSettled(
    files.map((f) => {
      const filePath = path.posix.join(dir, f.name)
      if (ignorePattern.test(filePath)) {
        return
      }
      if (f.isDirectory()) {
        return walkFiles({ dir: filePath, ignorePattern }, handler)
      }
      return handler(filePath)
    })
  )
}

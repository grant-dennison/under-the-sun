import fs from "node:fs/promises";
import path from "node:path";

export async function walkFiles(
  dir: string,
  handler: (filePath: string) => PromiseLike<void>
) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  await Promise.allSettled(
    files.map((f) => {
      const filePath = path.posix.join(dir, f.name);
      if (f.isDirectory()) {
        return walkFiles(filePath, handler);
      }
      return handler(filePath);
    })
  );
}

import fs from "fs/promises";
import path from "path";

export async function forEachTestFile(
  dir: string,
  testFilePathRegex: RegExp,
  handler: (filePath: string) => PromiseLike<void>
) {
  await walkDir(dir, async (f) => {
    if (testFilePathRegex.test(f)) {
      handler(f);
    }
  });
}

async function walkDir(
  dir: string,
  handler: (filePath: string) => PromiseLike<void>
) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  await Promise.all(
    files.map((f) => {
      const filePath = path.posix.join(dir, f.name);
      if (f.isDirectory()) {
        return walkDir(filePath, handler);
      }
      return handler(filePath);
    })
  );
}

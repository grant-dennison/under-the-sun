import path from "node:path"

export const cliToCwdPath = path
  .relative(__dirname, process.cwd())
  .replace(/\\/g, "/")

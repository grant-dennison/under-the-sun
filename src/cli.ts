import path from "path"
import { stallTestCompletion } from "./define-test"
import { forEachTestFile } from "./gather-tests"
import { parseCliArgs } from "./parse-cli-args"
import { reportFailure } from "./test-reporter"

const args = parseCliArgs(process.argv)

const relativeMe = path.relative(__dirname, process.cwd()).replace(/\\/g, "/")

for (const m of args.modulesToLoad) {
    if (/^\.{1,2}\//.test(m)) {
        require(path.posix.join(relativeMe, m))
    } else {
        require(m)
    }
}

stallTestCompletion(() => forEachTestFile(args.dir, args.testFilePathRegex, async (f) => {
    try {
        require(path.posix.join(relativeMe, f))
    } catch (e) {
        reportFailure(f, e, 0)
    }
}))

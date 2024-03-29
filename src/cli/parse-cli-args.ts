export function parseCliArgs(argv: readonly string[]) {
  try {
    return parseCliArgsThrowing(argv)
  } catch (e) {
    console.error(usage)
    throw e
  }
}

function parseCliArgsThrowing(argv: readonly string[]) {
  const args = {
    dir: ".",
    ignoreRegex: /(^|\/)(node_modules($|\/)|\.)/,
    testFilePathRegex1: /\.(spec|test)\.[mc]?[jt]sx?$/,
    testFilePathRegex2: /.*/,
    testDescriptionRegex: /.*/,
    magicGlobal: false,
    modulesToLoad: [] as string[],
    serial: false,
  }

  const argsArr = argv.slice(2)
  let positionalArgsConsumed = 0
  const readNextArg = () => {
    const arg = argsArr.shift() as string
    switch (arg) {
      case "-h":
      case "--help":
        console.log(usage)
        process.exit(2)
        return
      case "-i":
      case "--ignore": {
        const i = argsArr.shift()
        if (!i) {
          throw new Error("-i/--ignore requires an argument")
        }
        args.ignoreRegex = new RegExp(i)
        return
      }
      case "-m":
      case "--magic":
        args.magicGlobal = true
        return
      case "-p":
      case "--pattern": {
        const p = argsArr.shift()
        if (!p) {
          throw new Error("-p/--pattern requires an argument")
        }
        args.testFilePathRegex1 = new RegExp(p)
        return
      }
      case "-r":
      case "--require": {
        const r = argsArr.shift()
        if (!r) {
          throw new Error("-r requires an argument")
        }
        args.modulesToLoad.push(r)
        return
      }
      case "-s":
      case "--serial":
        args.serial = true
        return
    }
    if (arg.startsWith("-")) {
      if (arg.includes("=")) {
        throw new Error(
          `Unrecognized option ${arg}. (This tool does not support \`--some-arg=some-value\`-style options. Use \`--some-arg some-value\` instead.)`
        )
      }
      throw new Error(`Unrecognized option ${arg}`)
    }
    positionalArgsConsumed++
    switch (positionalArgsConsumed) {
      case 1:
        args.dir = arg
        return
      case 2:
        args.testFilePathRegex2 = new RegExp(arg)
        return
      case 3:
        args.testDescriptionRegex = new RegExp(arg)
        return
    }
    throw new Error(`Too many arguments, starting with ${arg}`)
  }
  while (argsArr.length > 0) {
    readNextArg()
  }

  return args
}

const usage = `
Usage:
  under-the-sun [-r <module>] [-m] [-s] [-p <file pattern>]
                [<dir> [<file filter> [<description filter>]]]

Parameters:
  <dir>                 Directory in which to find tests
  <file filter>         Regex pattern for matching test file names,
                        applied *in addition to* -p/--pattern
  <description filter>  Regex pattern for matching test descriptions

Options:
  --magic, -m     Make "test" available as a global        [boolean]
  --pattern, -p   Regex pattern for matching test files     [string]
  --require, -r   Preload the specified module at startup   [string]
  --serial, -s    Run tests sequentially, not in parallel  [boolean]
`

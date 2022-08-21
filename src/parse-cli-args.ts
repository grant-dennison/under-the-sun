export function parseCliArgs(argv: readonly string[]) {
    const args = {
        dir: ".",
        testFilePathRegex: /\.test\.(j|t)s$/,
        modulesToLoad: [] as string[]
    }
    
    const argsArr = argv.slice(2)
    let positionalArgsConsumed = 0
    const readNextArg = () => {
        const arg = argsArr.shift() as string
        switch (arg) {
            case "-r":
                const m = argsArr.shift()
                if (!m) {
                    throw new Error('-r requires an argument')
                }
                args.modulesToLoad.push(m)
                return
        }
        if (arg.startsWith("-")) {
            throw new Error(`Unrecognized option ${arg}`)
        }
        switch (positionalArgsConsumed) {
            case 0:
                args.dir = arg
                return
            case 1:
                args.testFilePathRegex = new RegExp(arg)
                return
        }
        throw new Error(`Too many arguments, starting with ${arg}`)
    }
    while (argsArr.length > 0) {
        readNextArg()
    }

    return args
}
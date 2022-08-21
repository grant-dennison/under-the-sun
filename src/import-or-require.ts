
// This idea was taken from uvu: https://github.com/lukeed/uvu/blob/56e1cb25ecd76cbf5cd3fd28c7a4c07db405c5c3/bin.js

const dimport = (x: string) => new Function(`return import(${ JSON.stringify(x) })`).call(0);

const hasImport = (() => {
    try { new Function('import').call(0) }
    catch (err) { return !/unexpected/i.test((err as Error).message) }
})();

// This is the strategy uvu used.
// I'm not convinced it works as well for my use cases.
export async function importOrRequire(m: string) {
    if (hasImport) {
        await dimport(m)
    } else {
        require(m)
    }
}

export async function requireThenImport(m: string) {
    try {
        require(m)
    } catch (e) {
        if (e instanceof Error && (e as unknown as Record<string, unknown>).code === "ERR_REQUIRE_ESM") {
            dimport(m)
        } else {
            throw e
        }
    }
}

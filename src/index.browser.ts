function noOp() {
  // Do nothing. This library is not currently supported in the browser.
}

function notDefined() {
  throw new Error(
    "This library (under-the-sun) is not currently supported in the browser"
  )
}

export const defineTestGroup = noOp
export const test = noOp
export const setTestReporter = notDefined

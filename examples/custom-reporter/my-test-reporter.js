const { setTestReporter } = require("under-the-sun")

let failure = false
setTestReporter({
  reportResult(testDescription, testResult) {
    if (testResult.error) {
      // Do something about test failure.
      failure = true
      console.error("LOOK OUT!!! " + testDescription)
      console.error(JSON.stringify(testResult.error))
    } else {
      // Do something about test success.
      console.log(`Yay it passed! (${testDescription})`)
    }
  },
  reportFinish() {
    // Finalize the test run.
    console.log("Kaboom!")
    process.exit(failure ? 1 : 0)
  },
})

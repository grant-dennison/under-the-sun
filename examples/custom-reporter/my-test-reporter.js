const { setTestReporter } = require("under-the-sun")

let failure = false
setTestReporter({
    reportSuccess(testDescription) {
      // Do something about test success.
      console.log(`Yay it passed! (${testDescription})`)
    },
    reportFailure(testDescription, error) {
      // Do something about test failure.
      failure = true
      console.error("LOOK OUT!!! " + testDescription)
      console.error(JSON.stringify(error))
    },
    finish() {
      // Finalize the test run.
      console.log("Kaboom!")
      process.exit(failure ? 1 : 0)
    },
})

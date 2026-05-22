import { coverageTests } from './coverageTests.js'
import { operationTests } from './operationTests.js'

await operationTests()
await coverageTests()

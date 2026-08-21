import { base58Tests } from './base58.js'
import { buildExportTests } from './buildExports.js'
import { coverageTests } from './coverageTests.js'
import { operationTests } from './operationTests.js'

await base58Tests()
await buildExportTests()
await operationTests()
await coverageTests()

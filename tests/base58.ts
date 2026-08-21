import { decode, encode } from '../src/helpers/base58.js'

export const base58Tests = async () => {
  console.log('Testing base58...\n')

  let totalTests = 0
  let passedTests = 0

  const runTest = (name: string, testFn: () => boolean) => {
    totalTests++
    try {
      if (testFn()) {
        console.log(`✅ ${name}`)
        passedTests++
      } else {
        console.log(`❌ ${name}`)
      }
    } catch (error) {
      console.log(`❌ ${name}:`, error)
    }
  }

  const bytesEqual = (a: Uint8Array, b: Uint8Array) =>
    a.length === b.length && a.every((v, i) => v === b[i])

  runTest('encodes the bs58 README vector', () => {
    const bytes = Uint8Array.from([
      0, 60, 23, 110, 101, 155, 234, 15, 41, 163, 233, 191, 120, 128, 193, 18, 177, 179, 27, 77,
      200, 38, 38, 129, 135
    ])
    return encode(bytes) === '16UjcYNBG9GTK4uq2f7yYEbuifqCzoLMGS'
  })

  runTest('decodes the bs58 README vector', () => {
    const bytes = Uint8Array.from([
      0, 60, 23, 110, 101, 155, 234, 15, 41, 163, 233, 191, 120, 128, 193, 18, 177, 179, 27, 77,
      200, 38, 38, 129, 135
    ])
    return bytesEqual(decode('16UjcYNBG9GTK4uq2f7yYEbuifqCzoLMGS'), bytes)
  })

  runTest('encodes empty input as empty string', () => encode(new Uint8Array()) === '')

  runTest('decodes empty string as empty bytes', () => decode('').length === 0)

  runTest('preserves leading zero bytes as "1"', () => encode(new Uint8Array([0, 0, 1])) === '112')

  runTest('roundtrips Hive WIF payload', () => {
    const wifBody = 'JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw'
    return encode(decode('5' + wifBody)) === '5' + wifBody
  })

  runTest('throws on invalid character', () => {
    try {
      decode('0OIl')
      return false
    } catch {
      return true
    }
  })

  console.log(`\nBase58 tests: ${passedTests}/${totalTests} passed\n`)
  if (passedTests !== totalTests) {
    throw new Error(`${totalTests - passedTests} base58 test(s) failed`)
  }
}

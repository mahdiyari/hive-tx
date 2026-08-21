import { createRequire } from 'node:module'
import { readdir } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const distDir = join(dirname(fileURLToPath(import.meta.url)), '../dist')

export const buildExportTests = async () => {
  console.log('Testing built package exports...\n')

  let totalTests = 0
  let passedTests = 0

  const runTest = async (name: string, testFn: () => boolean | Promise<boolean>) => {
    totalTests++
    try {
      const result = await testFn()
      if (result) {
        console.log(`✅ ${name}`)
        passedTests++
      } else {
        console.log(`❌ ${name}`)
      }
    } catch (error) {
      console.log(`❌ ${name}:`, error)
    }
  }

  await runTest('CJS require("hive-tx") derives a public key', () => {
    const { PrivateKey } = require('hive-tx')
    const pub = PrivateKey.fromLogin('alice', 'x', 'posting').createPublic().toString()
    return typeof pub === 'string' && pub.startsWith('STM')
  })

  await runTest('ESM import("hive-tx") derives the same public key as CJS', async () => {
    const { PrivateKey: CjsPrivateKey } = require('hive-tx')
    const { PrivateKey: EsmPrivateKey } = await import('hive-tx')
    const cjs = CjsPrivateKey.fromLogin('alice', 'x', 'posting').createPublic().toString()
    const esm = EsmPrivateKey.fromLogin('alice', 'x', 'posting').createPublic().toString()
    return cjs === esm && cjs.startsWith('STM')
  })

  await runTest('dist is a single ESM file and a single CJS file (no extra chunks)', async () => {
    const files = await readdir(distDir)
    const js = files.filter((f) => f.endsWith('.mjs') || f.endsWith('.cjs')).sort()
    return js.length === 2 && js.includes('index.mjs') && js.includes('index.cjs')
  })

  await runTest('CJS build is self-contained (no require of ESM-only deps)', () => {
    const cjs = readFileSync(join(distDir, 'index.cjs'), 'utf8')
    return (
      !cjs.includes('require("bs58")') &&
      !cjs.includes("require('bs58')") &&
      !cjs.includes('require("@noble/') &&
      !cjs.includes("require('@noble/")
    )
  })

  await runTest('ESM build is self-contained (no runtime chunk or bare dep imports)', () => {
    const esm = readFileSync(join(distDir, 'index.mjs'), 'utf8')
    return (
      !/from\s*["']\.\/(chunk-|rolldown-runtime-)/.test(esm) &&
      !/^(?:import|export)\s.+\sfrom\s*['"](?:bs58|@noble\/)/m.test(esm)
    )
  })

  await runTest('package.json exports include dual types', () => {
    const pkg = JSON.parse(readFileSync(join(distDir, '../package.json'), 'utf8'))
    const root = pkg.exports?.['.']
    return (
      root?.import?.types === './dist/index.d.mts' &&
      root?.import?.default === './dist/index.mjs' &&
      root?.require?.types === './dist/index.d.cts' &&
      root?.require?.default === './dist/index.cjs'
    )
  })

  await runTest('JSDoc is stripped, license comments are kept', () => {
    const esm = readFileSync(join(distDir, 'index.mjs'), 'utf8')
    const cjs = readFileSync(join(distDir, 'index.cjs'), 'utf8')
    return (
      esm.includes('@license') &&
      cjs.includes('@license') &&
      !esm.includes('@example') &&
      !cjs.includes('@example')
    )
  })

  console.log(`\nBuild export tests: ${passedTests}/${totalTests} passed\n`)
  if (passedTests !== totalTests) {
    throw new Error(`${totalTests - passedTests} build export test(s) failed`)
  }
}

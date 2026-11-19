import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

/** Packages with a moderate or worse advisory, per `npm audit` */
const vulnerablePackages = (flags = '') => {
  let out: string
  try {
    out = execSync(`npm audit --json ${flags}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })
  } catch (e: any) {
    // npm audit exits 1 when it finds anything; the report is still on stdout
    out = e.stdout
  }
  const report = JSON.parse(out)
  if (report.error) {
    throw new Error(`npm audit failed: ${report.error.summary}`)
  }
  return Object.entries<{ severity: string }>(report.vulnerabilities ?? {})
    .filter(([, v]) => ['moderate', 'high', 'critical'].includes(v.severity))
    .map(([name]) => name)
}

/** Audits what users get: runtime dependencies plus the devDependencies bundled into dist */
export const auditTests = async () => {
  console.log('Auditing shipped dependencies...\n')

  let totalTests = 0
  let passedTests = 0

  const runTest = (name: string, found: string[]) => {
    totalTests++
    if (found.length === 0) {
      console.log(`✅ ${name}`)
      passedTests++
    } else {
      console.log(`❌ ${name}: ${found.join(', ')}`)
    }
  }

  runTest('Runtime dependencies have no known vulnerabilities', vulnerablePackages('--omit=dev'))

  // Bundled into dist by tsdown, so they ship even though they are devDependencies
  const bundled = Object.keys(pkg.inlinedDependencies ?? {})
  const devFindings = vulnerablePackages()
  runTest(
    `Bundled packages have no known vulnerabilities (${bundled.join(', ')})`,
    devFindings.filter((name) => bundled.includes(name))
  )

  const toolingOnly = devFindings.filter((name) => !bundled.includes(name))
  if (toolingOnly.length) {
    console.log(`ℹ️  Build tooling only, not shipped: ${toolingOnly.join(', ')}`)
  }

  console.log(`\nAudit tests: ${passedTests}/${totalTests} passed\n`)
  if (passedTests !== totalTests) {
    throw new Error(`${totalTests - passedTests} audit test(s) failed`)
  }
}

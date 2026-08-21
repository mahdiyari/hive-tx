import { defineConfig } from 'tsdown'

/**
 * Rolldown extracts its ESM runtime helper (`__exportAll`) into a hashed
 * sibling chunk. Serverless bundlers, CDNs, and a single-file `import` then
 * miss that chunk. Inline leftover ESM chunks into the entry.
 */
function inlineEsmChunks() {
  return {
    name: 'inline-esm-chunks',
    generateBundle(
      _options: unknown,
      bundle: Record<string, { type: string; isEntry?: boolean; code?: string }>
    ) {
      const esmChunks = Object.entries(bundle).filter(
        ([name, item]) => item.type === 'chunk' && name.endsWith('.mjs')
      )
      const entry = esmChunks.find(([, item]) => item.isEntry)
      if (!entry) return
      const [entryName, entryChunk] = entry
      if (typeof entryChunk.code !== 'string') return
      let code: string = entryChunk.code

      for (const [name, item] of esmChunks) {
        if (name === entryName || item.isEntry || !item.code) continue
        const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const importRe = new RegExp(
          `import\\s*\\{[^}]*\\}\\s*from\\s*["']\\./${escaped}["']\\s*;\\n?`
        )
        const next = code.replace(
          importRe,
          item.code.replace(/export\s*\{[^}]+\}\s*;?\s*$/, '')
        )
        if (next === code) continue
        code = next
        delete bundle[name]
      }
      entryChunk.code = code
    }
  }
}

export default defineConfig({
  entry: 'src/index.ts',
  format: ['esm', 'cjs'],
  // Universal: Node, browsers, workers, and serverless runtimes.
  // CJS is still forced to `node` by rolldown; ESM stays platform-agnostic.
  platform: 'neutral',
  fixedExtension: true,
  plugins: [inlineEsmChunks()],
  outputOptions: {
    comments: {
      legal: true,
      annotation: true,
      jsdoc: false
    }
  },
  exports: {
    customExports(exports) {
      const root = exports['.']
      if (root && typeof root === 'object' && 'import' in root && 'require' in root) {
        exports['.'] = {
          import: {
            types: './dist/index.d.mts',
            default: root.import
          },
          require: {
            types: './dist/index.d.cts',
            default: root.require
          }
        }
      }
      return exports
    }
  },
  deps: {
    // Bundle ESM-only noble crypto so CJS/serverless consumers do not have to
    // resolve it themselves.
    alwaysBundle: ['@noble/ciphers', '@noble/curves', '@noble/hashes'],
    onlyBundle: false
  }
})

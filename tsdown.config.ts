import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  format: ['esm', 'cjs'],
  exports: true,
  platform: 'node',
  deps: {
    neverBundle: []
  }
})

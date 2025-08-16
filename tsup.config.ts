import { defineConfig } from 'tsup';

export default defineConfig({
    format: ['cjs', 'esm'],
    entry: {
        index: 'src/index.ts'
    },

    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true,
    loader: {
        '.ttf': 'dataurl',
        '.icc': 'dataurl'
    },
    esbuildOptions(options) {
        options.chunkNames = 'chunks/[name]-[hash]';
    }
});

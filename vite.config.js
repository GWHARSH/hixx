import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import obfuscator from 'vite-plugin-javascript-obfuscator';

export default defineConfig({
  plugins: [
    react(),

    // ── JavaScript Obfuscation (build only) ──────────────────────────
    // Applied to production bundles only — dev remains readable for workflow
    obfuscator({
      include: [/src\/.*\.(js|jsx|ts|tsx)$/],
      exclude: [/node_modules/],
      apply: 'build',
      options: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.8,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.3,
        debugProtection: true,
        debugProtectionInterval: 4000,
        disableConsoleOutput: false, // keep console for troll messages
        identifierNamesGenerator: 'mangled-shuffled',
        log: false,
        numbersToExpressions: true,
        renameGlobals: false,
        selfDefending: true,
        simplify: true,
        splitStrings: true,
        splitStringsChunkLength: 8,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayCallsTransformThreshold: 0.75,
        stringArrayEncoding: ['base64', 'rc4'],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 3,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 5,
        stringArrayWrappersType: 'function',
        stringArrayThreshold: 0.85,
        transformObjectKeys: true,
        unicodeEscapeSequence: false, // true makes bundle too big
      },
    }),
  ],

  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },

  build: {
    // ── No source maps — ever ──
    sourcemap: false,

    // ── Terser for extra minification pass ──
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console — we use it for troll messages
        drop_debugger: false, // Keep debugger — used in devtools trap
        passes: 3,
        unsafe: true,
        unsafe_math: true,
        unsafe_proto: true,
        pure_getters: true,
        toplevel: true,
        dead_code: true,
        evaluate: true,
        collapse_vars: true,
        sequences: true,
        booleans: true,
        conditionals: true,
        if_return: true,
        join_vars: true,
      },
      mangle: {
        toplevel: true,
        keep_fnames: false,
        properties: {
          regex: /^_private_/,
        },
      },
      output: {
        comments: false,
        ascii_only: true,
        beautify: false,
      },
    },

    // ── Chunk splitting ──────────────────────────────────────────────
    rollupOptions: {
      output: {
        // Randomized asset filenames — harder to map file purposes
        assetFileNames: 'assets/[hash:20][extname]',
        chunkFileNames: 'assets/[hash:20].js',
        entryFileNames: 'assets/[hash:20].js',

        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'v0';
            }
            if (id.includes('framer-motion')) {
              return 'v1';
            }
            if (id.includes('firebase')) {
              return 'v2';
            }
            return 'v3';
          }
        },
      },
      // Silence treeshake warnings
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
    },

    // ── Target modern browsers — smaller bundles ──
    target: 'es2020',

    // ── CSS code splitting ──
    cssCodeSplit: true,

    // ── Report bundle sizes ──
    reportCompressedSize: false,

    // ── Chunk size warning threshold ──
    chunkSizeWarningLimit: 2000,
  },

  // ── Dependency optimization ──────────────────────────────────────
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
    exclude: [],
  },
});

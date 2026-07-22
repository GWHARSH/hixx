import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import obfuscator from 'vite-plugin-javascript-obfuscator';

// Detect Netlify / CI environment — skip obfuscation on build runners
const isCI = Boolean(process.env.CI || process.env.NETLIFY);
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ══════════════════════════════════════════════════════════════════
//  IMMORTAL BOT SHIELD — Server-side middleware
//  Intercepts ALL requests before files are served.
//  Catches: HTTrack, wget, curl, Scrapy, Python, Go clients,
//           headless browsers, SEO crawlers, AI scrapers, archiver bots.
// ══════════════════════════════════════════════════════════════════

// ── Load troll page once at startup ──────────────────────────────
const TROLL_HTML = (() => {
  try {
    return readFileSync(resolve(__dirname, 'public/troll.html'), 'utf-8');
  } catch {
    return `<!DOCTYPE html><html><head><title>403</title></head><body
      style="background:#020204;color:#f472b6;font-family:monospace;display:flex;
             align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center">
      <div><h1 style="font-size:4rem">💀</h1><h2>GG NO RE SKID</h2>
      <p style="color:#6a6a7a">Protected by IMMORTAL Security Protocol v5.0</p></div>
    </body></html>`;
  }
})();

// ── Known bad User-Agent substrings ──────────────────────────────
// Split into HARD (blocked on all environments) and SOFT (production only).
const HARD_BLOCK_UA = [
  // Website downloaders / mirrors
  'httrack', 'webcopier', 'teleport', 'webstripper', 'blackwidow',
  'offline explorer', 'sitesucker', 'sitesnagger', 'webzip',
  'webmirror', 'webgather', 'copycat', 'pagegrabber',
  // CLI HTTP clients
  'wget/', 'curl/', 'libwww', 'libwww-perl',
  // Language HTTP clients
  'python-requests', 'python-urllib', 'python-httpx',
  'go-http-client', 'java/', 'okhttp/', 'ruby',
  'node-fetch', 'axios/', 'got/', 'superagent',
  // Scrapers / crawlers
  'scrapy', 'nutch', 'larbin', 'htmlunit',
  // Email harvesters
  'emailsiphon', 'emailwolf', 'extractorpro',
  // Headless
  'phantomjs', 'headlesschrome', 'headless',
  // Generic bots with no browser context
  'lwp-request', 'lwp-trivial', 'urllib',
];

const SOFT_BLOCK_UA = [
  // SEO / data bots (block in production)
  'ahrefsbot', 'semrushbot', 'mj12bot', 'dotbot', 'blexbot',
  'petalbot', 'dataforseobot', 'bytespider', 'yisouspider',
  // AI crawlers
  'claudebot', 'gptbot', 'chatgpt-user', 'ccbot', 'anthropic-ai',
  'omgili', 'diffbot', 'proximic', 'perplexitybot', 'cohere-ai',
  'facebookexternalhit', 'meta-externalagent',
  // Archive / mirror bots
  'ia_archiver', 'archive.org_bot', 'webarchive',
  // Generic aggressive crawlers
  'screaming frog', 'spider', 'crawler', 'robot', 'bot/',
];

// ── Allowed bots (search engines — don't block for SEO) ──────────
const ALLOWED_UA = ['googlebot', 'bingbot', 'duckduckbot', 'yandexbot', 'baiduspider'];

function isModernBrowserUA(ua) {
  return /(chrome|crios|firefox|fxios|edg|edge|safari|opr|opera|vivaldi|samsungbrowser|ucbrowser|silk)/i.test(ua) &&
    !/(headless|phantomjs|curl|wget|bot|spider|crawler|python|java|okhttp|ruby|go-http-client|node-fetch|axios|superagent|libwww)/i.test(ua);
}

function hasBrowserNavigationFingerprint(req) {
  return Boolean(
    req.headers['accept-language'] &&
    req.headers['accept-encoding'] &&
    (req.headers['sec-fetch-mode'] || req.headers['sec-ch-ua'] || req.headers['sec-ch-ua-mobile'])
  );
}

function isHostileClient(req) {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const host = (req.headers.host || '').toLowerCase();
  const accept = req.headers['accept'] || '';
  const url = req.url || '/';

  // ── Always skip internal Vite plumbing (HMR, module serving) ────
  // These are NOT web pages — they're Vite's own transport layer.
  if (
    url.startsWith('/@vite') ||
    url.startsWith('/@react-refresh') ||
    url.startsWith('/node_modules') ||
    url === '/healthz' ||
    url === '/favicon.ico' ||
    url.endsWith('.hot-update.js') ||
    url.endsWith('.hot-update.json')
  ) return false;

  // ── Allow legitimate search engines everywhere ───────────────────
  if (ALLOWED_UA.some(p => ua.includes(p))) return false;

  // ── HARD BLOCK — runs on ALL environments including localhost ────
  // If you're using wget/curl/httrack, you get trolled. Period.
  if (HARD_BLOCK_UA.some(p => ua.includes(p))) return true;

  // Empty or suspiciously short UA
  if (!ua || ua.length < 8) return true;

  // UA starts with a language/tool identifier (not a browser)
  if (/^(java|perl|python|ruby|go|curl|wget|fetch|http|lwp|libwww)/i.test(ua)) return true;

  // ── SOFT BLOCK — production domains only ─────────────────────────
  // On replit.dev (preview) we relax extra checks so dev isn't annoying.
  const isProd =
    !host.includes('localhost') &&
    !host.includes('127.0.0.1') &&
    !host.includes('replit.dev') &&
    !host.includes('replit.co');

  if (isProd) {
    // SEO/AI/archiver bots
    if (SOFT_BLOCK_UA.some(p => ua.includes(p))) return true;

    // Navigation fingerprint: real browsers usually send these headers.
    // Some mobile and embedded browsers may omit sec-fetch-mode but still
    // include accept-language / accept-encoding and modern browser identifiers.
    const isNavRequest =
      url === '/' ||
      (accept.includes('text/html') && accept.includes('application/xhtml'));

    if (isNavRequest) {
      const hasBrowserFingerprint = hasBrowserNavigationFingerprint(req);
      if (!hasBrowserFingerprint && !isModernBrowserUA(ua)) return true;
    }

    // Direct asset pulls without a browser Referer = likely a scraper
    // downloading files rather than browsing through the page.
    const isAssetReq = /\.(js|css|jsx|ts)(\?|$)/.test(url);
    if (isAssetReq && !req.headers['referer'] && !req.headers['sec-fetch-dest'] && !req.headers['sec-ch-ua']) {
      return true;
    }
  }

  return false;
}

// ── The middleware factory ────────────────────────────────────────
function immortalBotShieldMiddleware(req, res, next) {
  if (!isHostileClient(req)) { next(); return; }

  const ua = req.headers['user-agent'] || 'unknown';
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '?';
  console.log(`[IMMORTAL] Blocked: ${ip} — UA: ${ua.slice(0, 80)}`);

  res.writeHead(403, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'X-Robots-Tag': 'noindex, noarchive, nosnippet, noodp, noimageindex',
    'X-Immortal-Shield': 'BLOCKED',
    'X-Frame-Options': 'DENY',
  });
  res.end(TROLL_HTML);
}

// ── Vite plugin that installs the middleware ──────────────────────
function immortalBotShieldPlugin() {
  return {
    name: 'immortal-bot-shield',
    // Dev server
    configureServer(server) {
      server.middlewares.use(immortalBotShieldMiddleware);
    },
    // Production preview server
    configurePreviewServer(server) {
      server.middlewares.use(immortalBotShieldMiddleware);
    },
  };
}

// ══════════════════════════════════════════════════════════════════
export default defineConfig({
  root: resolve(__dirname),
  base: '/',
  publicDir: resolve(__dirname, 'public'),
  plugins: [
    react(),

    // ── Bot shield runs FIRST (before static file serving) ──────
    immortalBotShieldPlugin(),

    // ── JavaScript Obfuscation (local builds only, skipped on CI/Netlify) ──
    ...(!isCI ? [obfuscator({
      enforce: 'post',
      apply: 'build',
      include: [/\.js$/, /\.jsx$/],
      exclude: [/node_modules/],
      options: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.3,
        deadCodeInjection: false,
        debugProtection: false,
        debugProtectionInterval: 0,
        disableConsoleOutput: false,
        identifierNamesGenerator: 'mangled-shuffled',
        log: false,
        numbersToExpressions: true,
        renameGlobals: false,
        selfDefending: false,
        simplify: true,
        splitStrings: true,
        splitStringsChunkLength: 8,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayCallsTransformThreshold: 0.75,
        stringArrayEncoding: ['base64'],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 2,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 4,
        stringArrayWrappersType: 'function',
        stringArrayThreshold: 0.75,
        transformObjectKeys: false,
        unicodeEscapeSequence: false,
      },
    })] : []),
  ],

  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },

  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: false,
        passes: 2,
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
        toplevel: false,
        keep_fnames: false,
      },
      format: {
        comments: false,
        ascii_only: true,
        beautify: false,
      },
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/clown-assets-[hash:8][extname]';
          }
          return 'assets/[name]-[hash:8][extname]';
        },
        chunkFileNames: 'assets/troll-logic-[hash:8].js',
        entryFileNames: 'assets/security-core-[hash:8].js',
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          // Split vendor libraries into separate obfuscated troll-logic chunks
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'react-vendor';
          if (id.includes('framer-motion')) return 'motion-vendor';
          if (id.includes('firebase')) return 'firebase-vendor';
          return 'common-vendor';
        },
      },
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
    },
    target: 'es2020',
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 2000,
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
});

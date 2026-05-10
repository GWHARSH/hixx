import { useEffect } from 'react';

// ═══════════════════════════════════════════════════════════
//  YAMATO SECURITY PROTOCOL v4.0 — HARDENED PRODUCTION GRADE
// ═══════════════════════════════════════════════════════════

function injectTrollConsole() {
  setTimeout(() => {
    // Big ASCII banner
    console.log(
      '%c⛩  YAMATO',
      [
        'color:#f472b6',
        'font-size:64px',
        'font-weight:900',
        'font-family:Outfit,sans-serif',
        'text-shadow:0 0 40px rgba(244,114,182,0.9),0 0 80px rgba(217,70,239,0.6)',
        'letter-spacing:-2px',
      ].join(';')
    );

    console.log(
      '%cSECURITY PROTOCOL — ACTIVE',
      [
        'color:#d946ef',
        'font-size:13px',
        'font-weight:800',
        'letter-spacing:5px',
        'font-family:monospace',
      ].join(';')
    );

    console.log(
      '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'color:rgba(244,114,182,0.25)'
    );

    // Fake terminal output
    const lines = [
      ['[YAMATO] Connecting to monitoring endpoint...', '#9090a8'],
      ['[YAMATO] Visitor session registered.', '#9090a8'],
      [`[YAMATO] Timestamp: ${new Date().toISOString()}`, '#9090a8'],
      ['[YAMATO] Browser fingerprint: ████████████████ — STORED', '#f472b6'],
      ['[YAMATO] Forwarding telemetry to security relay...', '#9090a8'],
      ['[YAMATO] ✓ Monitoring active.', '#23a55a'],
    ];

    lines.forEach(([msg, color], i) => {
      setTimeout(() => {
        console.log(`%c${msg}`, `color:${color};font-family:monospace;font-size:12px`);
      }, i * 180);
    });

    setTimeout(() => {
      console.log(
        '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        'color:rgba(244,114,182,0.25)'
      );

      console.log(
        '%c👁  YOU WERE DETECTED',
        [
          'color:#f472b6',
          'font-size:22px',
          'font-weight:900',
          'font-family:Outfit,sans-serif',
        ].join(';')
      );

      const trolls = [
        '💀  Bro thought he was hacking NASA',
        '😂  Imagine stealing frontend code in 2026',
        '🤡  Touch grass instead of opening the Sources tab',
        '🛡️  Nice try, skid. This site is protected.',
        '📡  Your session is being monitored. Enjoy the show.',
        '🚬  Every file you request gets logged. Relax.',
      ];

      trolls.forEach((t, i) => {
        setTimeout(() => {
          console.log(
            `%c${t}`,
            'color:#9090a8;font-size:13px;font-family:monospace;padding:2px 0'
          );
        }, i * 100);
      });

      setTimeout(() => {
        console.log(
          '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          'color:rgba(244,114,182,0.25)'
        );
        console.log(
          '%c⚠  WARNING: Attempting to copy, scrape, or mirror this website\n   violates YAMATO Terms of Service and may result in legal action.',
          'color:#f0b232;font-size:12px;font-family:monospace;font-weight:600'
        );
      }, 900);
    }, lines.length * 180 + 100);
  }, 800);
}

function buildWarningScreen(triggerType) {
  const fp = Math.random().toString(36).substr(2, 16).toUpperCase();
  const fakeIp = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
  const ts = new Date().toISOString();

  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
      *{margin:0;padding:0;box-sizing:border-box}
      body{background:#020204;overflow:hidden;font-family:'Outfit',sans-serif}

      .yw-root{
        position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;
        justify-content:center;background:#020204;z-index:2147483647;padding:24px;
      }
      .yw-noise{
        position:absolute;inset:0;
        background:url('data:image/svg+xml,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%25" height="100%25" filter="url(%23n)" opacity="0.035"/></svg>');
        pointer-events:none;
      }
      .yw-grid{
        position:absolute;inset:0;
        background:linear-gradient(rgba(244,114,182,0.02) 1px,transparent 1px),
                   linear-gradient(90deg,rgba(244,114,182,0.02) 1px,transparent 1px);
        background-size:60px 60px;pointer-events:none;
      }
      .yw-orb1{
        position:absolute;top:-20%;right:-10%;width:600px;height:600px;border-radius:50%;
        background:radial-gradient(circle,rgba(244,114,182,0.07),transparent 70%);
        pointer-events:none;
      }
      .yw-orb2{
        position:absolute;bottom:-20%;left:-10%;width:500px;height:500px;border-radius:50%;
        background:radial-gradient(circle,rgba(217,70,239,0.06),transparent 70%);
        pointer-events:none;
      }

      .yw-card{
        position:relative;z-index:2;width:100%;max-width:680px;
        background:rgba(255,255,255,0.018);
        border:1px solid rgba(244,114,182,0.12);
        border-radius:24px;padding:40px;
        box-shadow:0 0 0 1px rgba(255,255,255,0.03),
                   0 32px 80px rgba(0,0,0,0.8),
                   inset 0 1px 0 rgba(255,255,255,0.04);
        text-align:center;
      }

      .yw-shield{
        width:72px;height:72px;border-radius:50%;margin:0 auto 28px;
        display:flex;align-items:center;justify-content:center;
        background:rgba(244,114,182,0.08);
        border:1.5px solid rgba(244,114,182,0.25);
        animation:shield-pulse 2.5s ease-in-out infinite;
      }
      @keyframes shield-pulse{
        0%,100%{box-shadow:0 0 0 0 rgba(244,114,182,0.2)}
        50%{box-shadow:0 0 0 16px rgba(244,114,182,0)}
      }

      .yw-badge{
        display:inline-flex;align-items:center;gap:6px;
        font-size:0.68rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;
        color:#f0b232;background:rgba(240,178,50,0.08);
        border:1px solid rgba(240,178,50,0.2);border-radius:4px;padding:4px 12px;margin-bottom:20px;
      }

      .yw-title{
        font-size:clamp(1.6rem,6vw,2.6rem);font-weight:900;letter-spacing:-1px;
        background:linear-gradient(135deg,#f472b6,#d946ef);
        -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        margin-bottom:12px;line-height:1.1;
      }

      .yw-sub{
        font-size:0.95rem;color:#6a6a7a;line-height:1.65;max-width:460px;margin:0 auto 28px;
      }

      .yw-terminal{
        background:#0a0a0d;border:1px solid rgba(255,255,255,0.06);border-radius:12px;
        padding:16px 20px;margin-bottom:24px;text-align:left;font-family:'JetBrains Mono',monospace;
        font-size:0.74rem;color:#4a4a5a;line-height:1.9;
      }
      .yw-terminal .hi{color:#f472b6}
      .yw-terminal .ok{color:#23a55a}
      .yw-terminal .warn{color:#f0b232}

      .yw-chips{
        display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px;
      }
      .yw-chip{
        padding:10px 8px;border:1px solid rgba(255,255,255,0.05);
        background:rgba(255,255,255,0.02);border-radius:10px;
        font-size:0.72rem;color:#4a4a5a;font-family:'JetBrains Mono',monospace;
      }
      .yw-chip span{display:block;color:#f472b6;font-weight:700;margin-bottom:2px;font-size:0.78rem}

      .yw-footer{font-size:0.65rem;text-transform:uppercase;letter-spacing:3px;color:#2a2a3a}

      @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
      .yw-cursor{animation:blink 1s step-end infinite}
    </style>

    <div class="yw-root">
      <div class="yw-noise"></div>
      <div class="yw-grid"></div>
      <div class="yw-orb1"></div>
      <div class="yw-orb2"></div>

      <div class="yw-card">
        <div class="yw-shield">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f472b6" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>

        <div class="yw-badge">⚠ SECURITY ALERT — TRIGGER: ${triggerType}</div>

        <h1 class="yw-title">ACCESS RESTRICTED</h1>
        <p class="yw-sub">
          Developer Tools detected. This website is protected by the YAMATO Security Protocol.<br>
          Close DevTools and refresh to continue.
        </p>

        <div class="yw-terminal">
          <div>[YAMATO-SECURE] <span class="hi">INTRUSION ATTEMPT LOGGED</span></div>
          <div>[YAMATO-SECURE] Timestamp: <span class="hi">${ts}</span></div>
          <div>[YAMATO-SECURE] Fingerprint: <span class="hi">${fp}</span></div>
          <div>[YAMATO-SECURE] Trigger: <span class="warn">${triggerType}</span></div>
          <div>[YAMATO-SECURE] Status: <span class="ok">REPORTED ✓</span><span class="yw-cursor">_</span></div>
        </div>

        <div class="yw-chips">
          <div class="yw-chip"><span>SESSION</span>${fp.slice(0,8)}</div>
          <div class="yw-chip"><span>TRIGGER</span>${triggerType.slice(0,10)}</div>
          <div class="yw-chip"><span>PROTOCOL</span>v4.0</div>
        </div>

        <p class="yw-footer">© ${new Date().getFullYear()} YAMATO Security · All Rights Reserved</p>
      </div>
    </div>
  `;
}

export default function DevToolsBlocker() {
  useEffect(() => {

    // ── Guard 1: Never block inside an iframe (Replit preview, embeds) ──
    try {
      if (window.self !== window.top) return;
    } catch {
      return; // cross-origin iframe — skip
    }

    // ── Guard 2: Skip on dev / Replit workspace domains ──
    const host = window.location.hostname;
    const isDevDomain =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.endsWith('.local') ||
      host.includes('replit.dev') ||
      host.includes('replit.co') ||
      host.includes('webcontainer');

    // ── Always inject troll console messages ──
    injectTrollConsole();

    // ── Skip active blocking on dev domains ──
    if (isDevDomain) return;

    // ── Production Protection Below ──

    let blocked = false;
    let detectInterval = null;

    const block = (reason) => {
      if (blocked) return;
      blocked = true;
      clearInterval(detectInterval);

      document.body.innerHTML = buildWarningScreen(reason);
      document.body.style.overflow = 'hidden';

      // Infinite debugger trap to break breakpoints
      const trapLoop = () => {
        if (!blocked) return;
        // eslint-disable-next-line no-debugger
        debugger;
        setTimeout(trapLoop, 150);
      };
      setTimeout(trapLoop, 300);
    };

    // ── Keyboard shortcut blocking ──
    const onKey = (e) => {
      const blocked_keys =
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && [73, 74, 67].includes(e.keyCode)) || // Ctrl+Shift+I/J/C
        (e.ctrlKey && e.keyCode === 85) || // Ctrl+U (view source)
        (e.ctrlKey && e.keyCode === 83); // Ctrl+S (save)

      if (blocked_keys) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }
    };

    // ── Right-click / context menu ──
    const onContext = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    window.addEventListener('keydown', onKey, true);
    window.addEventListener('contextmenu', onContext, true);

    // ── DevTools size detection (most reliable method) ──
    // Only triggers on significant difference — avoids false positives from:
    // - Browser zoom
    // - Mobile browser chrome
    // - Normal UI chrome (scrollbars etc)
    const SIDE_THRESHOLD = 200;  // side-docked devtools
    const BOTTOM_THRESHOLD = 200; // bottom-docked devtools

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    const checkSize = () => {
      if (blocked || isMobile) return;
      const wDiff = window.outerWidth - window.innerWidth;
      const hDiff = window.outerHeight - window.innerHeight;
      if (wDiff > SIDE_THRESHOLD || hDiff > BOTTOM_THRESHOLD) {
        block('DEVTOOLS_SIZE');
      }
    };

    // ── Console getter trap (fires when console inspects objects) ──
    // This only triggers if someone actually has the console open AND is
    // actively logging — so very low false positive rate
    let consoleTrapFired = false;
    const consoleTrap = Object.defineProperty({}, '__yt_trap__', {
      get() {
        if (!consoleTrapFired) {
          consoleTrapFired = true;
          // Give a grace period — some browsers auto-log on load
          setTimeout(() => block('CONSOLE_OPEN'), 2000);
        }
        return 0;
      },
    });

    // Inject trap into console stream (only once)
    setTimeout(() => {
      if (!blocked) {
        console.log('%c ', consoleTrap);
      }
    }, 3000);

    // ── Polling: check every 2.5s (lightweight) ──
    detectInterval = setInterval(checkSize, 2500);

    // ── Resize event fallback ──
    window.addEventListener('resize', checkSize);

    return () => {
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('contextmenu', onContext, true);
      window.removeEventListener('resize', checkSize);
      clearInterval(detectInterval);
    };
  }, []);

  return null;
}

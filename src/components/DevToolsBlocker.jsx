import { useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
//  IMMORTAL SECURITY PROTOCOL v5.0 — TROLL & PROTECT EDITION
//  Strategy: Don't block DevTools — CLOWN them inside it.
// ═══════════════════════════════════════════════════════════════

// ── 1. Troll HTML for "downloaded" site ──────────────────────
function buildTrollDownloadHTML() {
  const ts = new Date().toISOString();
  const fp = Math.random().toString(36).substr(2, 16).toUpperCase();
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>nice_try_skid.html</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Outfit:wght@900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{background:#020204;color:#f472b6;font-family:'JetBrains Mono',monospace;
     display:flex;align-items:center;justify-content:center;min-height:100vh;
     text-align:center;padding:40px;overflow:hidden}
.noise{position:fixed;inset:0;background:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");pointer-events:none;z-index:0}
.wrap{position:relative;z-index:1;max-width:620px}
pre.ascii{font-size:clamp(0.45rem,1.8vw,0.8rem);color:#f472b6;opacity:.7;line-height:1.2;margin-bottom:28px;font-family:'JetBrains Mono',monospace;white-space:pre}
h1{font-family:'Outfit',sans-serif;font-size:clamp(2rem,8vw,4rem);font-weight:900;
   background:linear-gradient(135deg,#f472b6,#d946ef);-webkit-background-clip:text;
   -webkit-text-fill-color:transparent;background-clip:text;margin-bottom:16px;letter-spacing:-2px}
.sub{color:#6a6a7a;font-size:.9rem;line-height:1.8;margin-bottom:28px}
.term{background:#0a0a0d;border:1px solid rgba(244,114,182,.1);border-radius:12px;
      padding:20px;text-align:left;font-size:.75rem;line-height:2;color:#3a3a4a;margin-bottom:24px}
.term .hi{color:#f472b6}.term .ok{color:#23a55a}.term .warn{color:#f0b232}
.footer{color:#2a2a3a;font-size:.65rem;letter-spacing:3px;text-transform:uppercase}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.cur{animation:blink 1s step-end infinite}
</style>
</head>
<body>
<div class="noise"></div>
<div class="wrap">
<pre class="ascii">
       ██╗███╗   ███╗███╗   ███╗ ██████╗ ██████╗ ████████╗ █████╗ ██╗     
       ██║████╗ ████║████╗ ████║██╔═══██╗██╔══██╗╚══██╔══╝██╔══██╗██║     
       ██║██╔████╔██║██╔████╔██║██║   ██║██████╔╝   ██║   ███████║██║     
       ██║██║╚██╔╝██║██║╚██╔╝██║██║   ██║██╔══██╗   ██║   ██╔══██║██║     
       ██║██║ ╚═╝ ██║██║ ╚═╝ ██║╚██████╔╝██║  ██║   ██║   ██║  ██║███████╗
       ╚═╝╚═╝     ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
</pre>

<h1>💀 GG NO RE, SKID 💀</h1>
<p class="sub">
  Congrats! You successfully downloaded IMMORTAL.<br>
  ...the <strong style="color:#f472b6">TROLL EDITION</strong>, that is.<br>
  The real site is still protected. Try harder next time.
</p>

<div class="term">
<div>[IMMORTAL] Save attempt detected at: <span class="hi">${ts}</span></div>
<div>[IMMORTAL] Session fingerprint: <span class="hi">${fp}</span></div>
<div>[IMMORTAL] Attempting to extract source bundles<span class="cur">_</span></div>
<div>[IMMORTAL] Locating encrypted JS chunks... <span class="warn">ERROR 403</span></div>
<div>[IMMORTAL] Accessing asset manifests... <span class="warn">ERROR 403</span></div>
<div>[IMMORTAL] Bypassing IMMORTAL payload... <span class="warn">FAILED</span></div>
<div>[IMMORTAL] Status: <span class="ok">You got: ABSOLUTELY NOTHING ✓</span></div>
<br>
<div style="color:#2a2a3a"># L + ratio + touch grass</div>
<div style="color:#2a2a3a"># Imagine trying to steal frontend code in ${new Date().getFullYear()}</div>
<div style="color:#2a2a3a"># bro thought he was hacking NASA 💀</div>
</div>

<p class="footer">Protected by IMMORTAL Security Protocol v5.0 · ${new Date().getFullYear()}</p>
</div>
</body>
</html>`;
}

// ── 2. Poison LocalStorage & SessionStorage ───────────────────
function poisonStorage() {
  try {
    const fp = Math.random().toString(36).substr(2, 16);
    const now = Date.now();
    const fakeHeader = btoa('{"alg":"HS256","typ":"JWT"}').replace(/=/g, '');
    const fakePayload = btoa(JSON.stringify({
      sub: `visitor_${fp.slice(0, 8)}`,
      iat: Math.floor(now / 1000),
      exp: Math.floor(now / 1000) + 3600,
      role: 'GUEST_MONITORED',
      immortal: true,
      session: fp,
    })).replace(/=/g, '');
    const fakeSig = fp.split('').reverse().join('') + fp.slice(0, 8);

    const fakeJwt = `${fakeHeader}.${fakePayload}.${fakeSig}`;

    // ─ LocalStorage troll entries ─
    localStorage.setItem('_ym_session_token', fakeJwt);
    localStorage.setItem('_ym_encryption_key', '⚠ [PROTECTED — IMMORTAL v5.0 AES-256-GCM — REDACTED]');
    localStorage.setItem('_ym_fingerprint', JSON.stringify({
      hash: fp,
      timestamp: now,
      logged: true,
      threat_level: 'MONITORING',
      ip_logged: true,
      browser_fp: navigator.userAgent.length.toString(16),
    }));
    localStorage.setItem('_ym_threat_level', 'GREEN — MONITORING ACTIVE');
    localStorage.setItem('_ym_intruder_log', JSON.stringify([
      { time: new Date().toISOString(), event: 'PAGE_LOAD', status: 'LOGGED', fp },
    ]));
    localStorage.setItem(
      '_ym_WARNING',
      '⚠ IMMORTAL SECURITY: Do NOT modify these values. ' +
      'This session is actively monitored. ' +
      'All changes are logged server-side and forwarded to the security team.'
    );
    localStorage.setItem('_ym_relay', atob('d3NzOi8veWFtYXRvLXNlY3VyZS5yZWxheS5pbw=='));
    localStorage.setItem('_ym_build_hash', 'sha256-' + fp + fp.slice(0, 8));

    // ─ SessionStorage troll entries ─
    sessionStorage.setItem('_ym_session_id', fp);
    sessionStorage.setItem('_ym_nonce', btoa(fp).replace(/=/g, ''));
    sessionStorage.setItem('_ym_access_granted', 'false');
    sessionStorage.setItem('_ym_security_level', 'MAXIMUM');
    sessionStorage.setItem('_ym_rate_limit_remaining', '0');
    sessionStorage.setItem('_ym_blocked_attempts', '1');
  } catch (_) { }
}

// ── 3. Troll the Elements Tab ─────────────────────────────────
function trollDOM() {
  try {
    const fp = Math.random().toString(36).substr(2, 12).toUpperCase();
    const ts = Date.now();

    // Attributes on <html> and <body>
    document.documentElement.setAttribute('data-immortal', 'v5.0');
    document.documentElement.setAttribute('data-immortal-encrypted', 'true');
    document.documentElement.setAttribute('data-immortal-fp', fp);
    document.documentElement.setAttribute('data-immortal-build', 'prod-obfuscated');
    document.documentElement.setAttribute('data-immortal-relay', 'active');

    document.body.setAttribute('data-session', fp.toLowerCase());
    document.body.setAttribute('data-immortal-verified', 'true');
    document.body.setAttribute('data-immortal-ts', ts);
    document.body.setAttribute('data-immortal-monitor', 'online');

    // Fake meta tags in <head>
    const metaData = [
      ['immortal-signature', `sha256-${fp}${fp.slice(0, 8)}`],
      ['immortal-protected', 'true; mode=strict'],
      ['immortal-encrypt-algo', 'AES-256-GCM+RC4'],
      ['immortal-timestamp', new Date().toISOString()],
      ['immortal-relay', atob('d3NzOi8veWFtYXRvLXNlY3VyZS5yZWxheS5pbw==')],
    ];
    metaData.forEach(([name, content]) => {
      const m = document.createElement('meta');
      m.name = name;
      m.content = content;
      document.head.appendChild(m);
    });

    // Hidden decoy elements in <body>
    const decoys = [
      {
        id: '__ym_core__',
        attrs: { 'data-immortal-role': 'CORE', 'data-immortal-enc': `AES:${fp}`, 'aria-hidden': 'true' },
        comment: ' IMMORTAL ENCRYPTED CORE MODULE — DO NOT INSPECT ',
      },
      {
        id: '__ym_payload__',
        attrs: { 'data-immortal-role': 'PAYLOAD', 'data-immortal-hash': `sha256:${fp.toLowerCase()}`, 'aria-hidden': 'true' },
        comment: ' IMMORTAL OBFUSCATED PAYLOAD v5.0 — MODIFICATION DETECTED AND LOGGED ',
      },
      {
        id: '__ym_monitor__',
        attrs: { 'data-immortal-role': 'MONITOR', 'data-immortal-status': 'ACTIVE', 'aria-hidden': 'true' },
        comment: ' IMMORTAL REALTIME MONITORING MODULE — SESSION TRACKED ',
      },
      {
        id: '__ym_decoy_a__',
        attrs: { 'data-role': 'encrypted-bundle', 'data-enc': `RC4:${fp}:${ts}`, 'aria-hidden': 'true' },
        comment: ' ENCRYPTED JS BUNDLE FRAGMENT [RC4+B64] — DO NOT COPY ',
      },
    ];

    decoys.forEach(({ id, attrs, comment }) => {
      if (document.getElementById(id)) return;
      const div = document.createElement('div');
      div.id = id;
      div.style.cssText = 'display:none!important;visibility:hidden!important;pointer-events:none!important;position:absolute!important;width:0!important;height:0!important;overflow:hidden!important';
      Object.entries(attrs).forEach(([k, v]) => div.setAttribute(k, v));
      div.appendChild(document.createComment(comment));
      document.body.appendChild(div);
    });

    // HTML comments inside <body> at top
    const bodyComment = document.createComment(
      ` IMMORTAL SECURITY PROTOCOL v5.0 ACTIVE | FP: ${fp} | TS: ${ts} | SESSION: MONITORED | BUILD: ENCRYPTED `
    );
    document.body.insertBefore(bodyComment, document.body.firstChild);

    // Self-healing: if decoy elements are removed, re-add them
    const observer = new MutationObserver(() => {
      decoys.forEach(({ id }) => {
        if (!document.getElementById(id)) trollDOM();
      });
    });
    observer.observe(document.body, { childList: true, subtree: false });

  } catch (_) { }
}

// ── 4. Enhanced Console Troll ─────────────────────────────────
function injectConsole() {
  setTimeout(() => {
    // Giant header
    console.log(
      '%c⛩ IMMORTAL',
      'color:#f472b6;font-size:72px;font-weight:900;font-family:Outfit,sans-serif;' +
      'text-shadow:0 0 50px rgba(244,114,182,0.9),0 0 100px rgba(217,70,239,0.6);letter-spacing:-3px'
    );
    console.log(
      '%cSECURITY PROTOCOL v5.0 - ACTIVE',
      'color:#d946ef;font-size:14px;font-weight:800;letter-spacing:5px;font-family:monospace'
    );
    console.log('%c' + '━'.repeat(62), 'color:rgba(244,114,182,0.2)');

    // Fake terminal sequence
    const seq = [
      ['[IMMORTAL] Initializing session monitor...', '#9090a8', 0],
      [`[IMMORTAL] Timestamp: ${new Date().toISOString()}`, '#9090a8', 150],
      ['[IMMORTAL] Scanning visitor environment...', '#9090a8', 300],
      ['[IMMORTAL] Browser fingerprint: ████████████ → LOGGED', '#f472b6', 500],
      ['[IMMORTAL] DevTools state: MONITORED', '#f0b232', 700],
      ['[IMMORTAL] Relay connection: ESTABLISHED', '#9090a8', 900],
      ['[IMMORTAL] Threat assessment: RUNNING...', '#9090a8', 1100],
      ['[IMMORTAL] ✓ Security protocol: ACTIVE', '#23a55a', 1350],
    ];

    seq.forEach(([msg, color, delay]) => {
      setTimeout(() => {
        console.log(`%c${msg}`, `color:${color};font-family:monospace;font-size:12px`);
      }, delay);
    });

    setTimeout(() => {
      console.log('%c' + '━'.repeat(62), 'color:rgba(244,114,182,0.2)');

      console.log(
        '%c👁  SO YOU OPENED DEVTOOLS',
        'color:#f472b6;font-size:24px;font-weight:900;font-family:Outfit,sans-serif'
      );

      const roasts = [
        ['💀  Bro thought he was hacking NASA', '#9090a8'],
        ['😂  Imagine trying to steal frontend code in ' + new Date().getFullYear(), '#9090a8'],
        ['🤡  Touch grass instead of inspecting elements', '#9090a8'],
        ['🛡️  Everything you see in Elements is decoy content', '#f472b6'],
        ['📁  All JS bundles are obfuscated + encrypted at build time', '#f472b6'],
        ['📡  This session is being monitored. Enjoy the console.', '#9090a8'],
        ['🚬  Your fingerprint was logged 3 seconds ago. Relax.', '#9090a8'],
        ['🔒  The real source? Encrypted. The DOM? Fake decoys.', '#f472b6'],
        ['🗑️  Even if you copy the HTML you get literally nothing useful', '#9090a8'],
        ['✌️  Regards, IMMORTAL Security Team', '#d946ef'],
      ];

      roasts.forEach(([msg, color], i) => {
        setTimeout(() => {
          console.log(`%c${msg}`, `color:${color};font-size:13px;font-family:monospace;padding:1px 0`);
        }, i * 80);
      });

      setTimeout(() => {
        console.log('%c' + '━'.repeat(62), 'color:rgba(244,114,182,0.2)');
        console.log(
          '%c⚠  WARNING',
          'color:#f0b232;font-size:18px;font-weight:800;font-family:Outfit,sans-serif'
        );
        console.log(
          '%cAttempting to copy, scrape, mirror, or download this website\n' +
          'is a violation of IMMORTAL Terms of Service and may result in\n' +
          'legal action. All attempts are logged with full session data.',
          'color:#6a6a7a;font-size:12px;font-family:monospace;line-height:1.9'
        );
        console.log('%c' + '━'.repeat(62), 'color:rgba(244,114,182,0.2)');

        // Sneaky fake table entry
        console.groupCollapsed('%c[IMMORTAL] Visitor Threat Report (click to expand)', 'color:#4a4a5a;font-size:11px;font-family:monospace');
        console.table({
          'DevTools': { status: '✓ DETECTED', severity: 'MEDIUM' },
          'Automation': { status: '✗ NOT DETECTED', severity: 'N/A' },
          'Scraper': { status: '✗ NOT DETECTED', severity: 'N/A' },
          'Download Attempt': { status: 'MONITORING', severity: 'MONITORING' },
        });
        console.groupEnd();
      }, roasts.length * 80 + 200);
    }, 1500);
  }, 1000);
}

// ── 5. Trigger Troll File Download ────────────────────────────
function triggerTrollDownload() {
  const html = buildTrollDownloadHTML();
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nice_try_skid.html';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export default function DevToolsBlocker() {
  useEffect(() => {

    // ── Always run: storage poison + DOM troll + console ──
    poisonStorage();
    trollDOM();
    injectConsole();

    // ── Skip active blocking if inside an iframe ──
    let inIframe = false;
    try { inIframe = window.self !== window.top; } catch { inIframe = true; }

    // ── Keyboard shortcuts ──
    const onKey = (e) => {
      // Ctrl+S → troll download instead of saving
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!inIframe) triggerTrollDownload();
        return false;
      }

      // Ctrl+U → open blank page instead of view-source
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }

      // F12 / Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
      if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && [73, 74, 67].includes(e.keyCode))
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }
    };

    // ── Right-click block ──
    const onContext = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // ── Print/Save-as DOM swap ──
    const onBeforePrint = () => {
      // Swap visible body content with troll page for print/save
      document.body.setAttribute('data-real-content', 'hidden');
      const troll = document.createElement('div');
      troll.id = '__ym_print_troll__';
      troll.style.cssText = 'position:fixed;inset:0;background:#020204;display:flex;align-items:center;justify-content:center;z-index:9999999;font-family:monospace;color:#f472b6;font-size:1.5rem;text-align:center;padding:40px';
      troll.innerHTML = '<div><div style="font-size:4rem;margin-bottom:20px">💀</div><h1 style="margin-bottom:12px">GG NO RE SKID</h1><p style="color:#6a6a7a;font-size:0.9rem">You got the troll edition.<br>Protected by IMMORTAL Security Protocol v5.0</p></div>';
      document.body.appendChild(troll);
    };

    const onAfterPrint = () => {
      const troll = document.getElementById('__ym_print_troll__');
      if (troll) document.body.removeChild(troll);
    };

    // ── Continuous Console Spam & Clear Loop ──
    const consoleInterval = setInterval(() => {
      try {
        console.clear();
        console.log(
          '%c⛩ IMMORTAL SECURITY',
          'color:#f472b6;font-size:40px;font-weight:900;text-shadow:0 0 20px #f472b6;font-family:sans-serif;'
        );
        console.log('%cPROTECTED BY IMMORTAL v5.0 — ACCESS DENIED', 'color:#d946ef;font-size:14px;font-weight:bold;font-family:monospace;');
        console.log('%cAll inspector operations are intercepted and logged to Discord. 😉', 'color:#6a6a7a;font-size:12px;font-family:monospace;');
        console.log('%c# L + ratio + touch grass + imagine trying to steal frontend code 💀', 'color:#4a4a5a;font-size:11px;font-family:monospace;');
      } catch (_) { }
    }, 1500);

    // ── Check for developer whitelist bypass ──
    let hasBypass = false;
    try {
      if (window.location.search.includes('bypass=hixx_master_key')) {
        localStorage.setItem('immortal_bypass', 'hixx_master_key');
        console.log('⛩️ IMMORTAL Bypass Authorized!');
      }
      hasBypass = localStorage.getItem('immortal_bypass') === 'hixx_master_key';
    } catch (_) { }

    if (hasBypass) {
      console.log('⛩️ IMMORTAL Security Protocol: Whitelisted developer bypass active.');
      return;
    }

    window.addEventListener('keydown', onKey, true);
    window.addEventListener('contextmenu', onContext, true);
    window.addEventListener('beforeprint', onBeforePrint);
    window.addEventListener('afterprint', onAfterPrint);

    // ── Devtools size detection & passive debugger loop ──
    if (!inIframe) {
      let blocked = false;
      const THRESHOLD = 200;
      const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

      let sizeInterval = null;
      let passiveInterval = null;

      const triggerLockdown = () => {
        if (blocked) return;
        blocked = true;

        clearInterval(sizeInterval);
        clearInterval(consoleInterval);
        clearInterval(passiveInterval);

        const fp = Math.random().toString(36).substr(2, 16).toUpperCase();

        // COMPLETELY WIPE THE SITE
        document.head.innerHTML = '<title>ACCESS DENIED</title><style>body{background:#020204;margin:0}</style>';
        document.body.innerHTML = `
          <style>
            *{margin:0;padding:0;box-sizing:border-box}
            body{background:#020204;font-family:'Outfit',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;overflow:hidden;color:#fff}
            .r{position:relative;z-index:2;text-align:center;padding:40px;max-width:600px}
            .shield{width:70px;height:70px;margin:0 auto 24px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(244,114,182,0.08);border:1.5px solid rgba(244,114,182,0.2);animation:sp 2.5s ease-in-out infinite}
            @keyframes sp{0%,100%{box-shadow:0 0 0 0 rgba(244,114,182,.25)}50%{box-shadow:0 0 0 18px rgba(244,114,182,0)}}
            h1{font-size:2.4rem;font-weight:900;background:linear-gradient(135deg,#f472b6,#d946ef);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:12px}
            p{color:#6a6a7a;font-size:.9rem;line-height:1.7;margin-bottom:20px}
            .term{background:#0a0a0d;border:1px solid rgba(244,114,182,.1);border-radius:10px;padding:14px 18px;text-align:left;font-family:monospace;font-size:.72rem;color:#4a4a5a;line-height:1.9}
            .h{color:#f472b6}.ok{color:#23a55a}
          </style>
          <div class="r">
            <div class="shield">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f472b6" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h1>ACCESS RESTRICTED</h1>
            <p>Developer Tools detected. This website is protected by<br>the IMMORTAL Security Protocol. Close DevTools to continue.</p>
            <div class="term">
              <div>[IMMORTAL] <span class="h">DEVTOOLS DETECTED</span></div>
              <div>[IMMORTAL] Session: <span class="h">${fp}</span></div>
              <div>[IMMORTAL] Timestamp: <span class="h">${new Date().toISOString()}</span></div>
              <div>[IMMORTAL] Status: <span class="ok">LOGGED ✓</span></div>
              <div style="margin-top:10px;color:#2a2a3a"># Imagine trying to steal code in ${new Date().getFullYear()} 💀</div>
            </div>
          </div>`;
        document.body.style.overflow = 'hidden';
        const trap = () => { debugger; setTimeout(trap, 100); }; // eslint-disable-line no-debugger
        setTimeout(trap, 300);
      };

      const checkSize = () => {
        if (blocked || isMobile) return;
        if (
          window.outerWidth - window.innerWidth > THRESHOLD ||
          window.outerHeight - window.innerHeight > THRESHOLD
        ) {
          triggerLockdown();
        }
      };

      // ── Passive Debugger Check (Catches undocked DevTools!) ──
      passiveInterval = setInterval(() => {
        if (blocked) return;
        const start = performance.now();
        debugger; // eslint-disable-line no-debugger
        const end = performance.now();
        if (end - start > 100) {
          triggerLockdown();
        }
      }, 1000);

      sizeInterval = setInterval(checkSize, 2500);
      window.addEventListener('resize', checkSize);

      return () => {
        window.removeEventListener('keydown', onKey, true);
        window.removeEventListener('contextmenu', onContext, true);
        window.removeEventListener('beforeprint', onBeforePrint);
        window.removeEventListener('afterprint', onAfterPrint);
        window.removeEventListener('resize', checkSize);
        clearInterval(sizeInterval);
        clearInterval(consoleInterval);
        clearInterval(passiveInterval);
      };
    }

    return () => {
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('contextmenu', onContext, true);
      window.removeEventListener('beforeprint', onBeforePrint);
      window.removeEventListener('afterprint', onAfterPrint);
      clearInterval(consoleInterval);
    };
  }, []);

  return null;
}

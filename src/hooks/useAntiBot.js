import { useEffect } from 'react';

// ── Bot/Automation/Headless Detection Hook ──────────────────────────
// Checks for Selenium, Puppeteer, Playwright, PhantomJS, headless Chrome,
// HTTrack, wget-based scrapers, and other automation agents.
// On detection, replaces the page with a troll/prank screen.

function buildBotScreen() {
  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
      *{margin:0;padding:0;box-sizing:border-box}
      body{background:#020204;font-family:'JetBrains Mono',monospace;color:#4a4a5a;
           display:flex;align-items:center;justify-content:center;min-height:100vh;padding:40px}
      .bt-card{max-width:580px;width:100%;text-align:center}
      .bt-ascii{
        font-size:clamp(0.5rem,2vw,0.85rem);line-height:1.3;
        color:#f472b6;margin-bottom:32px;opacity:0.6;
        white-space:pre;font-family:'JetBrains Mono',monospace;
      }
      .bt-title{font-size:clamp(1rem,5vw,1.8rem);font-weight:700;color:#f472b6;margin-bottom:12px;letter-spacing:2px}
      .bt-sub{color:#4a4a5a;font-size:0.82rem;line-height:1.8;margin-bottom:28px}
      .bt-term{
        background:#0a0a0d;border:1px solid rgba(255,255,255,0.05);border-radius:8px;
        padding:16px;text-align:left;font-size:0.72rem;color:#3a3a4a;line-height:1.9;
      }
      .bt-term .hi{color:#f472b6}.bt-term .ok{color:#23a55a}.bt-term .dim{color:#2a2a3a}
    </style>
    <div class="bt-card">
      <pre class="bt-ascii">
██╗   ██╗ █████╗ ███╗   ███╗ █████╗ ████████╗ ██████╗
╚██╗ ██╔╝██╔══██╗████╗ ████║██╔══██╗╚══██╔══╝██╔═══██╗
 ╚████╔╝ ███████║██╔████╔██║███████║   ██║   ██║   ██║
  ╚██╔╝  ██╔══██║██║╚██╔╝██║██╔══██║   ██║   ██║   ██║
   ██║   ██║  ██║██║ ╚═╝ ██║██║  ██║   ██║   ╚██████╔╝
   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝</pre>
      <h1 class="bt-title">🤖 BOT DETECTED</h1>
      <p class="bt-sub">
        Nice try, scraper.<br>
        This site detects headless browsers, automation tools, and download bots.<br>
        You get nothing. Goodbye.
      </p>
      <div class="bt-term">
        <div>[BOT-TRAP] <span class="hi">Automation agent identified</span></div>
        <div>[BOT-TRAP] User-Agent spoofing: <span class="hi">FLAGGED</span></div>
        <div>[BOT-TRAP] webdriver property: <span class="hi">EXPOSED</span></div>
        <div>[BOT-TRAP] Request: <span class="hi">DENIED</span></div>
        <div>[BOT-TRAP] Session: <span class="ok">TERMINATED ✓</span></div>
        <div class="dim"># wget, HTTrack, Puppeteer, Selenium — all caught.</div>
      </div>
    </div>
  `;
}

export function useAntiBot() {
  useEffect(() => {
    // Skip inside iframes and dev domains
    try { if (window.self !== window.top) return; } catch { return; }
    const host = window.location.hostname;
    const isDev = host === 'localhost' || host === '127.0.0.1' ||
      host.includes('replit.dev') || host.includes('replit.co');
    if (isDev) return;

    const signals = [];

    // 1. Webdriver (Selenium, Puppeteer, Playwright)
    if (navigator.webdriver === true) signals.push('webdriver');

    // 2. PhantomJS
    if (window.callPhantom || window._phantom) signals.push('phantomjs');

    // 3. NightmareJS
    if (window.__nightmare) signals.push('nightmare');

    // 4. Selenium residues
    if (
      document.__selenium_evaluate ||
      document.__webdriver_evaluate ||
      document.__fxdriver_evaluate ||
      window._selenium ||
      window.callSelenium ||
      window._Selenium_IDE_Recorder
    ) signals.push('selenium');

    // 5. Chrome headless — missing standard APIs
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if (isChrome && !window.chrome) signals.push('headless-chrome');

    // 6. Zero plugins usually = headless
    if (
      isChrome &&
      navigator.plugins &&
      navigator.plugins.length === 0 &&
      !navigator.userAgent.includes('Edg')
    ) signals.push('no-plugins');

    // 7. Missing language
    if (!navigator.language || navigator.language === '') signals.push('no-language');

    // 8. Known bot user agent strings
    const ua = navigator.userAgent.toLowerCase();
    const botAgents = [
      'headless', 'phantomjs', 'selenium', 'webdriver', 'htmlunit',
      'httpclient', 'python-requests', 'go-http-client', 'curl/',
      'wget/', 'libwww', 'scrapy', 'httrack', 'nutch', 'ahrefsbot',
      'semrushbot', 'mj12bot', 'dotbot', 'blexbot',
    ];
    if (botAgents.some((b) => ua.includes(b))) signals.push('bot-ua');

    // 9. Automation-specific window properties
    const automationProps = [
      '__webdriver_script_fn', '__driver_evaluate', '__webdriver_unwrapped',
      '__selenium_unwrapped', '__fxdriver_unwrapped', 'domAutomation',
      'domAutomationController', '__driver_evaluate', '__lastWatirAlert',
      '__lastWatirConfirm', '__lastWatirPrompt',
    ];
    if (automationProps.some((p) => p in window || p in document)) {
      signals.push('automation-props');
    }

    // 10. Screen resolution anomalies (headless often 0x0 or weird values)
    if (screen.width === 0 || screen.height === 0) signals.push('zero-screen');

    // If 2+ signals — almost certainly a bot
    if (signals.length >= 2) {
      console.warn('[YAMATO] Bot/automation signals detected:', signals);
      document.body.innerHTML = buildBotScreen();
      document.body.style.overflow = 'hidden';
      return;
    }

    // Soft warn for single signal (could be false positive)
    if (signals.length === 1) {
      console.warn('[YAMATO] Suspicious signal:', signals[0]);
    }
  }, []);
}

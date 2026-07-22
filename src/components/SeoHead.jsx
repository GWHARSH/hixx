import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { forceHttps } from '../utils/security';

/**
 * SeoHead — dynamically manages document <head> meta tags
 * Reads SEO settings from Firebase and updates OG image, title, description.
 */
export default function SeoHead() {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings) return;

    // Update page title
    const rawTitle = settings.site_name || settings.hero_title || 'IMMORTAL';
    const finalTitle = `${rawTitle} - Official Website`;
    document.title = finalTitle;

    // Update meta description
    const baseDesc = settings.hero_description || 'Official portfolio of IMMORTAL. Explore uploads, gaming packages, and media.';
    const cleanDesc = baseDesc.replace(/—|–/g, ' - ');
    const seoDesc = `${cleanDesc} | Explore exclusive gaming packages & content.`.slice(0, 160);
    updateMeta('description', seoDesc);

    // Update keywords dynamically
    const keywords = 'IMMORTAL, immortal, immortal playz, gaming portfolio, gaming downloads, web developer, discord';
    updateMeta('keywords', keywords);

    // Update OG tags
    const logoUrl = forceHttps(settings.seo_logo_url);
    if (logoUrl) {
      updateMeta('og:image', logoUrl, 'property');
      updateMeta('twitter:image', logoUrl, 'property');
    }

    updateMeta('og:title', `${rawTitle} - Official Portfolio`, 'property');
    updateMeta('og:description', seoDesc, 'property');
    updateMeta('twitter:title', `${rawTitle} - Official Portfolio`, 'property');
    updateMeta('twitter:description', seoDesc, 'property');

    // Update favicon
    const faviconUrl = forceHttps(settings.favicon_url) || logoUrl || '/favicon.svg';
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
      existingFavicon.href = faviconUrl;
      if (faviconUrl.endsWith('.svg') || faviconUrl.startsWith('data:image/svg+xml')) {
        existingFavicon.type = 'image/svg+xml';
      } else if (faviconUrl.endsWith('.ico') || faviconUrl.startsWith('data:image/x-icon') || faviconUrl.includes('image/vnd.microsoft.icon') || faviconUrl.includes('x-icon')) {
        existingFavicon.type = 'image/x-icon';
      } else {
        existingFavicon.type = 'image/png';
      }
    }

    // Add JSON-LD structured data
    let jsonLdScript = document.getElementById('seo-jsonld');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'seo-jsonld';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: rawTitle,
      alternateName: ['IMMORTAL', 'Immortal'],
      description: seoDesc,
      image: logoUrl || '/og-image.png',
      url: 'https://alwaysharsh.lol',
      sameAs: getSameAsLinks(settings),
    });
  }, [settings]);

  return null;
}

function updateMeta(name, content, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function getSameAsLinks(settings) {
  const links = [];
  const platforms = ['instagram', 'twitter', 'youtube', 'github', 'discord'];
  platforms.forEach((p) => {
    try {
      const val = settings[p];
      if (!val) return;
      const parsed = typeof val === 'string' && val.startsWith('[') ? JSON.parse(val) : [{ url: val }];
      parsed.forEach((l) => { if (l.url) links.push(l.url); });
    } catch { /* skip */ }
  });
  return links;
}

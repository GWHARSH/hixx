import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '../lib/supabase';
import heroImg from '/hero-f1.jpg';

const STYLES = [
  { id: 'apex',       label: '01', name: 'APEX'       },
  { id: 'circuit',    label: '02', name: 'CIRCUIT'    },
  { id: 'podium',     label: '03', name: 'PODIUM'     },
  { id: 'velocity',   label: '04', name: 'VELOCITY'   },
  { id: 'slipstream', label: '05', name: 'SLIPSTREAM' },
];

// ── Shared social icons map ──────────────────────────────────
const SocialIcons = {
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
  ),
  twitter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
  ),
  youtube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.5 7.1 2 9.5 2 12c0 2.5.5 4.9.5 4.9.3 1.1 1.2 2 2.3 2.3C7.3 19.5 12 19.5 12 19.5s4.7 0 7.2-.3c1.1-.3 2-1.2 2.3-2.3.5-1.7.5-4.9.5-4.9s0-3.3-.5-4.9C21.2 6 20.3 5.1 19.2 4.8 16.7 4.5 12 4.5 12 4.5s-4.7 0-7.2.3C3.7 5.1 2.8 6 2.5 7.1z" /><polygon points="9.5 8.5 16 12 9.5 15.5 9.5 8.5" /></svg>
  ),
  github: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
  ),
  discord: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.27 4.57c-1.3-.6-2.69-1.05-4.14-1.3-.18.33-.39.7-.54 1.06-1.54-.23-3.07-.23-4.59 0-.15-.36-.36-.73-.54-1.06-1.45.25-2.84.7-4.14 1.3-2.62 3.91-3.33 7.72-2.98 11.47 1.74 1.28 3.42 2.06 5.06 2.57.41-.56.77-1.16 1.08-1.8-.59-.22-1.15-.51-1.68-.84.14-.1.28-.21.41-.32 3.3 1.53 6.89 1.53 10.18 0 .13.11.27.22.41.32-.53.33-1.09.62-1.68.84.31.64.67 1.24 1.08 1.8 1.64-.51 3.32-1.29 5.06-2.57.43-4.4-.73-8.19-2.98-11.47zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z" /></svg>
  ),
};

function SocialsRow({ socials, onSocialClick, className = '' }) {
  const entries = Object.entries(socials).filter(([, links]) => links[0]?.url);
  if (!entries.length) return null;
  return (
    <div className={`hero-socials ${className}`}>
      {entries.map(([key, links]) => (
        <motion.a
          key={key}
          href={links[0].url}
          onClick={(e) => onSocialClick(e, key, links)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={key}
          className="hero-social-icon"
          whileHover={{ scale: 1.15, y: -4 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          {SocialIcons[key]}
        </motion.a>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  STYLE 1 — APEX  (Full-bleed, centered minimal)
// ══════════════════════════════════════════════════════
function StyleApex({ socials, onSocialClick, scrollDown }) {
  return (
    <div className="hs hs--apex">
      <img src={heroImg} alt="" className="hs__bg-img" aria-hidden="true" />
      <div className="hs__overlay hs__overlay--apex" />
      <div className="hs__noise" />
      <div className="hs__orbs">
        <div className="hs__orb hs__orb--1" />
        <div className="hs__orb hs__orb--2" />
      </div>

      <motion.div className="hs__content hs__content--center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>

        <motion.p className="hs__eyebrow"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
          Genius · Playboy · Philanthropist · Leader
        </motion.p>

        <motion.h1 className="hs__title hs__title--apex"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}>
          <span className="hs__t-white">HIXX</span>
          <span className="hs__t-accent"> PLAYZ</span>
        </motion.h1>

        <div className="hs__apex-rule" />

        <motion.p className="hs__subtitle"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
          Making digital memories that last forever<br />
          while I enjoy my fking life. Unprofessional Discord E-gangster
        </motion.p>

        <SocialsRow socials={socials} onSocialClick={onSocialClick} />
      </motion.div>

      <motion.button className="hs__scroll" onClick={scrollDown}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        <ChevronDown size={26} />
      </motion.button>
      <div className="hs__fade-bottom" />
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  STYLE 2 — CIRCUIT  (50/50 split, diagonal cut)
// ══════════════════════════════════════════════════════
function StyleCircuit({ socials, onSocialClick, scrollDown }) {
  return (
    <div className="hs hs--circuit">
      {/* Right: F1 image panel */}
      <div className="hs__circuit-img-wrap">
        <img src={heroImg} alt="" className="hs__circuit-img" aria-hidden="true" />
        <div className="hs__circuit-img-fade" />
      </div>

      {/* Left: text */}
      <div className="hs__noise" />
      <motion.div className="hs__content hs__content--left"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>

        <motion.p className="hs__label-tag"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          DISCORD E-GANGSTER
        </motion.p>

        <motion.h1 className="hs__title hs__title--circuit"
          initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
          <span className="hs__t-white">HIXX</span><br />
          <span className="hs__t-accent">PLAYZ</span>
        </motion.h1>

        <motion.p className="hs__subtitle hs__subtitle--left"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          Making digital memories that last forever
          while I enjoy my fking life.
        </motion.p>

        <SocialsRow socials={socials} onSocialClick={onSocialClick} className="hero-socials--left" />

        <div className="hs__circuit-stats">
          <div className="hs__stat"><span className="hs__stat-num">∞</span><span className="hs__stat-label">Uploads</span></div>
          <div className="hs__stat-div" />
          <div className="hs__stat"><span className="hs__stat-num">∞</span><span className="hs__stat-label">Packages</span></div>
          <div className="hs__stat-div" />
          <div className="hs__stat"><span className="hs__stat-num">∞</span><span className="hs__stat-label">Members</span></div>
        </div>
      </motion.div>

      <motion.button className="hs__scroll hs__scroll--left" onClick={scrollDown}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        <ChevronDown size={26} />
      </motion.button>
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  STYLE 3 — PODIUM  (Title top-left, image bottom-right)
// ══════════════════════════════════════════════════════
function StylePodium({ socials, onSocialClick, scrollDown }) {
  return (
    <div className="hs hs--podium">
      <div className="hs__noise" />

      {/* Pink racing stripe */}
      <div className="hs__podium-stripe" />

      {/* F1 image bottom-right */}
      <div className="hs__podium-img-wrap">
        <img src={heroImg} alt="" className="hs__podium-img" aria-hidden="true" />
        <div className="hs__podium-img-fade" />
      </div>

      {/* Top-left content */}
      <motion.div className="hs__content hs__content--topleft"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>

        <motion.p className="hs__eyebrow hs__eyebrow--left"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          Genius · Playboy · Philanthropist · Leader
        </motion.p>

        <motion.h1 className="hs__title hs__title--podium"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.65 }}>
          <span className="hs__t-white">HIXX</span>
          <br />
          <span className="hs__t-accent">PLAYZ</span>
        </motion.h1>

        <motion.p className="hs__subtitle hs__subtitle--left"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          Making digital memories that last forever<br />
          while I enjoy my fking life.
        </motion.p>

        <SocialsRow socials={socials} onSocialClick={onSocialClick} className="hero-socials--left" />
      </motion.div>

      <motion.button className="hs__scroll" onClick={scrollDown}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        <ChevronDown size={26} />
      </motion.button>
      <div className="hs__fade-bottom" />
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  STYLE 4 — VELOCITY  (Cinematic dark panel left)
// ══════════════════════════════════════════════════════
function StyleVelocity({ socials, onSocialClick, scrollDown }) {
  return (
    <div className="hs hs--velocity">
      {/* Full-bleed image */}
      <img src={heroImg} alt="" className="hs__velocity-img" aria-hidden="true" />
      <div className="hs__velocity-vignette" />
      <div className="hs__noise" />

      {/* Left dark panel content */}
      <motion.div className="hs__content hs__content--left hs__content--velocity"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>

        <motion.div className="hs__velocity-badge"
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <span className="hs__velocity-dot" />
          LIVE SESSION
        </motion.div>

        <motion.h1 className="hs__title hs__title--velocity"
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
          <span className="hs__t-white">HIXX</span>
          <br />
          <span className="hs__t-accent">PLAYZ</span>
        </motion.h1>

        <motion.p className="hs__subtitle hs__subtitle--left"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          Making digital memories that last forever.<br />
          Unprofessional Discord E-gangster.
        </motion.p>

        <SocialsRow socials={socials} onSocialClick={onSocialClick} className="hero-socials--left" />
      </motion.div>

      <motion.button className="hs__scroll hs__scroll--left" onClick={scrollDown}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        <ChevronDown size={26} />
      </motion.button>
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  STYLE 5 — SLIPSTREAM  (Grid bg + 3D tilt card)
// ══════════════════════════════════════════════════════
function StyleSlipstream({ socials, onSocialClick, scrollDown }) {
  return (
    <div className="hs hs--slipstream">
      <div className="hs__grid-bg" />
      <div className="hs__noise" />
      <div className="hs__orbs">
        <div className="hs__orb hs__orb--1" />
        <div className="hs__orb hs__orb--2" />
      </div>

      {/* 3D tilted card on right */}
      <motion.div
        className="hs__slip-card"
        initial={{ opacity: 0, rotateY: -20, x: 60 }}
        animate={{ opacity: 1, rotateY: -8, x: 0 }}
        transition={{ delay: 0.4, duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        style={{ perspective: 1000 }}
      >
        <img src={heroImg} alt="F1 Car" className="hs__slip-img" />
        <div className="hs__slip-img-overlay" />
      </motion.div>

      {/* Left text content */}
      <motion.div className="hs__content hs__content--left hs__content--slip"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>

        <motion.p className="hs__label-tag"
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          DIGITAL CREATOR
        </motion.p>

        <motion.h1 className="hs__title hs__title--slipstream"
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}>
          <span className="hs__t-outline">HIXX</span>
          <br />
          <span className="hs__t-accent">PLAYZ</span>
        </motion.h1>

        <motion.p className="hs__subtitle hs__subtitle--left"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          Making digital memories that last forever.<br />
          Unprofessional Discord E-gangster.
        </motion.p>

        <SocialsRow socials={socials} onSocialClick={onSocialClick} className="hero-socials--left" />
      </motion.div>

      <motion.button className="hs__scroll" onClick={scrollDown}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        <ChevronDown size={26} />
      </motion.button>
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  MAIN HERO SECTION
// ══════════════════════════════════════════════════════
export default function HeroSection() {
  const [styleIdx, setStyleIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [socials, setSocials] = useState({ instagram: [], twitter: [], youtube: [], github: [], discord: [] });
  const [bgMusic, setBgMusic] = useState('/bg-music.mp3');
  const [modalData, setModalData] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    supabase.from('settings').select('*').single().then(({ data }) => {
      if (!data) return;
      const parse = (val) => {
        try {
          if (!val) return [];
          return typeof val === 'string' && val.startsWith('[')
            ? JSON.parse(val)
            : [{ title: 'Main', url: val }];
        } catch { return [{ title: 'Main', url: val }]; }
      };
      setSocials({
        instagram: parse(data.instagram),
        twitter: parse(data.twitter),
        youtube: parse(data.youtube),
        github: parse(data.github),
        discord: parse(data.discord),
      });
      if (data.bg_music_url) setBgMusic(data.bg_music_url);
    });
  }, []);

  const handleSocialClick = (e, platform, links) => {
    if (links && links.length > 1) {
      e.preventDefault();
      setModalData({ platform, links });
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMuted) { audioRef.current.play().catch(() => {}); }
    else { audioRef.current.pause(); }
    setIsMuted(!isMuted);
  };

  const scrollDown = () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });

  const StyleComponents = [StyleApex, StyleCircuit, StylePodium, StyleVelocity, StyleSlipstream];
  const ActiveStyle = StyleComponents[styleIdx];

  return (
    <section className="hero-wrapper" id="hero">
      <AnimatePresence mode="wait">
        <motion.div
          key={styleIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          style={{ height: '100%' }}
        >
          <ActiveStyle socials={socials} onSocialClick={handleSocialClick} scrollDown={scrollDown} />
        </motion.div>
      </AnimatePresence>

      {/* ── Style Switcher ── */}
      <div className="hs-switcher">
        <span className="hs-switcher__label">STYLES</span>
        {STYLES.map((s, i) => (
          <button
            key={s.id}
            className={`hs-switcher__btn ${styleIdx === i ? 'hs-switcher__btn--active' : ''}`}
            onClick={() => setStyleIdx(i)}
            aria-label={`Hero style ${s.name}`}
          >
            <span className="hs-switcher__num">{s.label}</span>
            <span className="hs-switcher__name">{s.name}</span>
          </button>
        ))}
      </div>

      {/* ── Music toggle ── */}
      <div className="music-toggle">
        <audio ref={audioRef} src={bgMusic} loop />
        <div className="music-toggle__controls">
          <button className="music-toggle__btn" onClick={toggleMusic} aria-label="Toggle Music">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="music-toggle__slider-wrap">
            <input
              type="range" min="0" max="1" step="0.01" defaultValue="0.5"
              className="music-toggle__slider"
              onChange={(e) => { if (audioRef.current) audioRef.current.volume = e.target.value; }}
            />
          </div>
        </div>
      </div>

      {/* ── Social link modal ── */}
      <AnimatePresence>
        {modalData && (
          <motion.div className="social-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModalData(null)}>
            <motion.div className="social-modal"
              initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}
              onClick={e => e.stopPropagation()}>
              <h3 className="social-modal__title">
                Choose <span className="text-accent">{modalData.platform}</span> Account
              </h3>
              <div className="social-modal__list">
                {modalData.links.map((link, idx) => (
                  <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="social-modal__item">
                    <span>{link.title || 'Visit Profile'}</span>
                    <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
                  </a>
                ))}
              </div>
              <button className="btn btn--outline btn--full" style={{ marginTop: '20px' }}
                onClick={() => setModalData(null)}>Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

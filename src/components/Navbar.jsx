import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { LogIn, LogOut, Shield, Sparkles, Key, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Home', path: '/', section: 'hero' },
  { name: 'Uploads', path: '/uploads', section: 'uploads' },
  { name: 'Packages', path: '/packages', section: 'packages' },
];

const SECTION_TO_PATH = {
  hero: '/',
  about: '/',
  uploads: '/uploads',
  packages: '/packages',
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [hoveredPath, setHoveredPath] = useState(null);
  const [clickPulse, setClickPulse] = useState(null);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [mobileMagicInput, setMobileMagicInput] = useState('');
  const [secretError, setSecretError] = useState('');

  const { settings } = useSettings();
  const { user, signOut, isUnlocked, unlockSecret } = useAuth();
  const location = useLocation();
  const observerRef = useRef(null);

  // Logo Tap & Long Press Gesture Tracking
  const tapTimesRef = useRef([]);
  const longPressTimerRef = useRef(null);

  const handleLogoClick = (e) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const now = Date.now();
    tapTimesRef.current = [...tapTimesRef.current.filter((t) => now - t < 2000), now];
    if (tapTimesRef.current.length >= 5) {
      tapTimesRef.current = [];
      unlockSecret();
    }
  };

  const handleLogoTouchStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      unlockSecret();
    }, 1800);
  };

  const handleLogoTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  const handleMobileMagicSubmit = (e) => {
    e.preventDefault();
    const val = mobileMagicInput.trim().toUpperCase();
    if (val === 'PHEONIX' || val === 'PHOENIX' || val === 'IMMORTAL') {
      unlockSecret();
      setShowSecretModal(false);
      setSecretError('');
      setMobileMagicInput('');
    } else {
      setSecretError('Incorrect. Try again.');
    }
  };

  const getBrandName = () => {
    if (!settings) return { first: 'IMMORTAL', second: '' };
    const name = settings.site_name || settings.hero_title || 'IMMORTAL';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return { first: parts[0], second: parts.slice(1).join(' ') };
    }
    return { first: parts[0] || '', second: '' };
  };

  const brandName = getBrandName();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleIntersect = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.id);
      }
    });
  }, []);

  useEffect(() => {
    const sections = ['hero', 'about', 'uploads', 'packages']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    });

    sections.forEach((sec) => observerRef.current.observe(sec));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersect, location.pathname]);

  const getActivePath = () => {
    if (location.pathname !== '/') return location.pathname;
    if (activeSection && SECTION_TO_PATH[activeSection]) {
      return SECTION_TO_PATH[activeSection];
    }
    return '/';
  };

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection(null);
    }
  }, [location.pathname, activeSection]);

  const activePath = getActivePath();

  const isAdmin = user?.role === 'admin';
  const links = isAdmin
    ? [...NAV_LINKS, { name: 'Admin', path: '/admin', isAdmin: true }]
    : NAV_LINKS;

  const triggerClickWave = (path) => {
    setClickPulse(path);
    setTimeout(() => setClickPulse(null), 600);
  };

  return (
    <>
      <motion.nav
        className={`nav2 ${scrolled ? 'nav2--scrolled' : ''}`}
        aria-label="Main navigation"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="nav2__bar">
          {/* Animated Neon Light Beam Border */}
          <div className="nav2__beam-trace" />

          {/* Logo with Multi-Tap (5x) & Long Press Secret Unlock for Mobile */}
          <Link
            to="/"
            className="nav2__logo"
            onClick={handleLogoClick}
            onTouchStart={handleLogoTouchStart}
            onTouchEnd={handleLogoTouchEnd}
            title="Tap 5x or Hold to Unlock Secret Access"
          >
            <motion.div
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            >
              <span className="nav2__logo-white nav2__logo-shimmer">{brandName.first}</span>
              {brandName.second && (
                <span className="nav2__logo-accent">{brandName.second}</span>
              )}

              {/* Pulsing Dot with Expanding Ripple Ring */}
              <div className="nav2__live-wrap">
                <span className="nav2__live-dot" />
                <span className="nav2__live-ring" />
              </div>
            </motion.div>
          </Link>

          {/* Center pill links with Dual Motion Pill + Glow Aura */}
          <div
            className="nav2__pill"
            onMouseLeave={() => setHoveredPath(null)}
          >
            {links.map((link) => {
              const isActive = activePath === link.path;
              const isHovered = hoveredPath === link.path;
              const isPulsing = clickPulse === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav2__link ${isActive ? 'nav2__link--active' : ''} ${
                    link.isAdmin ? 'nav2__link--admin' : ''
                  }`}
                  onMouseEnter={() => setHoveredPath(link.path)}
                  onClick={() => triggerClickWave(link.path)}
                >
                  {/* Hover backdrop pill indicator */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="nav-hover-pill"
                      className="nav2__hover-indicator"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}

                  {/* Active navigation pill indicator with glowing neon aura */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="nav2__pill-indicator"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}

                  {/* Click particle ripple wave */}
                  <AnimatePresence>
                    {isPulsing && (
                      <motion.span
                        className="nav2__click-wave"
                        initial={{ scale: 0, opacity: 0.8 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    )}
                  </AnimatePresence>

                  <motion.span
                    className="nav2__link-text"
                    whileHover={{ y: -2, scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    {link.isAdmin && (
                      <motion.span
                        style={{ display: 'inline-flex', marginRight: 4 }}
                        whileHover={{ rotate: 20, scale: 1.25 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <Shield size={13} color="#00F0FF" />
                      </motion.span>
                    )}
                    {link.name}
                  </motion.span>
                </Link>
              );
            })}
          </div>

          {/* Right side: Animated Login/Logout Button with Icon Motion & Burger */}
          <div className="nav2__right">
            <AnimatePresence mode="wait">
              {user ? (
                <motion.button
                  key="logout-btn"
                  className="nav2__btn nav2__btn--logout"
                  onClick={signOut}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.06, y: -1 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <motion.span
                    style={{ display: 'inline-flex' }}
                    whileHover={{ x: 3, rotate: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LogOut size={14} />
                  </motion.span>
                  <span>Logout</span>
                  <div className="nav2__btn-shine" />
                </motion.button>
              ) : isUnlocked ? (
                <motion.div
                  key="login-btn"
                  initial={{ opacity: 0, scale: 0.6, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.6, x: 20 }}
                  whileHover={{ scale: 1.06, y: -1 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                >
                  <Link to="/login" className="nav2__btn nav2__btn--primary">
                    <motion.span
                      style={{ display: 'inline-flex' }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <LogIn size={14} />
                    </motion.span>
                    <span>Login</span>
                    <div className="nav2__btn-shine" />
                  </Link>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <button
              className="nav2__burger"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <motion.span
                className="nav2__bline"
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
              <motion.span
                className="nav2__bline"
                animate={{
                  opacity: mobileOpen ? 0 : 1,
                  scaleX: mobileOpen ? 0 : 1,
                }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="nav2__bline"
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer with Staggered Scale-In Entrance */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="nav2__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="nav2__mobile"
              initial={{ opacity: 0, y: -20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.94 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {links.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                >
                  <Link
                    to={link.path}
                    className={`nav2__mob-link ${
                      activePath === link.path ? 'nav2__mob-link--active' : ''
                    } ${link.isAdmin ? 'nav2__mob-link--admin' : ''}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="nav2__mob-num">0{i + 1}</span>
                    {link.isAdmin && (
                      <Shield size={14} style={{ marginRight: 4 }} color="#00F0FF" />
                    )}
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <div className="nav2__mob-divider" />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.05 }}
              >
                {user ? (
                  <button
                    className="nav2__mob-auth"
                    onClick={() => {
                      signOut();
                      setMobileOpen(false);
                    }}
                  >
                    <LogOut size={15} /> Logout
                  </button>
                ) : isUnlocked ? (
                  <Link
                    to="/login"
                    className="nav2__mob-auth nav2__mob-auth--primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LogIn size={15} /> Login
                  </Link>
                ) : (
                  <button
                    className="nav2__mob-auth"
                    style={{ background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.15)', color: 'var(--accent)' }}
                    onClick={() => {
                      setMobileOpen(false);
                      setShowSecretModal(true);
                    }}
                  >
                    <Key size={15} /> Unlock Secret Access
                  </button>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Secret Mobile Key Prompt Modal */}
      <AnimatePresence>
        {showSecretModal && (
          <div className="social-modal-overlay" onClick={() => setShowSecretModal(false)}>
            <motion.div
              className="social-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative' }}
            >
              <button
                onClick={() => setShowSecretModal(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <Key size={28} color="#00F0FF" style={{ marginBottom: '8px' }} />
                <h3 className="social-modal__title" style={{ margin: 0 }}>Magic Word Protocol</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  Enter the magic word to reveal the login button.
                </p>
              </div>

              <form onSubmit={handleMobileMagicSubmit}>
                <div className="input-group" style={{ marginBottom: '12px' }}>
                  <Sparkles size={16} className="input-group__icon" />
                  <input
                    type="text"
                    placeholder="Enter magic word..."
                    value={mobileMagicInput}
                    data-allow-magic="true"
                    onChange={(e) => setMobileMagicInput(e.target.value)}
                    autoFocus
                  />
                </div>

                {secretError && (
                  <div style={{ color: '#38BDF8', fontSize: '0.8rem', marginBottom: '12px', textAlign: 'center' }}>
                    {secretError}
                  </div>
                )}

                <button type="submit" className="btn btn--primary btn--full">
                  Unlock Login Button
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

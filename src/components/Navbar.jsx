import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { LogIn, LogOut, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Home', path: '/', section: 'hero' },
  { name: 'Uploads', path: '/uploads', section: 'uploads' },
  { name: 'Packages', path: '/packages', section: 'packages' },
];

// Map section IDs to nav link paths
const SECTION_TO_PATH = {
  hero: '/',
  about: '/',
  uploads: '/uploads',
  packages: '/packages',
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const [activeSection, setActiveSection] = useState(null);
  const { settings } = useSettings();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const pillRef = useRef(null);
  const observerRef = useRef(null);

  // Get first and second parts of the site name dynamically from global settings context
  const getBrandName = () => {
    if (!settings) return { first: 'IMMU', second: 'BABY' };
    const name = settings.site_name || settings.hero_title || 'IMMU BABY';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return { first: parts[0], second: parts.slice(1).join(' ') };
    }
    return { first: parts[0] || '', second: '' };
  };

  const brandName = getBrandName();

  // ── Scroll detection ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  // ── Scroll-spy: IntersectionObserver on homepage ──
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection(null);
      if (observerRef.current) observerRef.current.disconnect();
      return;
    }

    const sectionIds = ['hero', 'about', 'uploads', 'packages'];
    const visibilityMap = {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap[entry.target.id] = entry.intersectionRatio;
        });

        // Find the section with the highest visibility
        let maxRatio = 0;
        let maxSection = 'hero';
        for (const id of sectionIds) {
          const ratio = visibilityMap[id] || 0;
          if (ratio > maxRatio) {
            maxRatio = ratio;
            maxSection = id;
          }
        }
        setActiveSection(maxSection);
      },
      {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1.0],
      }
    );

    observerRef.current = observer;

    // Observe all sections after a brief delay to ensure they're rendered
    const t = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, [location.pathname]);

  // ── Determine active link ──
  const getActivePath = useCallback(() => {
    if (location.pathname === '/' && activeSection) {
      return SECTION_TO_PATH[activeSection] || '/';
    }
    return location.pathname;
  }, [location.pathname, activeSection]);

  const activePath = getActivePath();

  // ── Indicator position update ──
  const updateIndicator = useCallback(() => {
    if (!pillRef.current) return;
    const active = pillRef.current.querySelector('.nav2__link--active');
    if (!active) { setIndicator(s => ({ ...s, opacity: 0 })); return; }
    const pr = pillRef.current.getBoundingClientRect();
    const ar = active.getBoundingClientRect();
    setIndicator({ left: ar.left - pr.left, width: ar.width, opacity: 1 });
  }, []);

  useEffect(() => {
    const t = setTimeout(updateIndicator, 20);
    window.addEventListener('resize', updateIndicator, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('resize', updateIndicator); };
  }, [activePath, updateIndicator]);

  const isAdmin = user?.role === 'admin';
  const links = isAdmin
    ? [...NAV_LINKS, { name: 'Admin', path: '/admin', isAdmin: true }]
    : NAV_LINKS;

  return (
    <>
      {/* ── Desktop / tablet ── */}
      <nav className={`nav2 ${scrolled ? 'nav2--scrolled' : ''}`} aria-label="Main navigation">
        <div className="nav2__bar">

          {/* Logo — dynamic from settings */}
          <Link to="/" className="nav2__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="nav2__logo-white">{brandName.first}</span>
            {brandName.second && <span className="nav2__logo-pink">{brandName.second}</span>}
          </Link>

          {/* Center pill links */}
          <div className="nav2__pill" ref={pillRef}>
            {/* Animated sliding background */}
            <motion.div
              className="nav2__pill-indicator"
              animate={{ left: indicator.left, width: indicator.width, opacity: indicator.opacity }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav2__link ${activePath === link.path ? 'nav2__link--active' : ''} ${link.isAdmin ? 'nav2__link--admin' : ''}`}
              >
                {link.isAdmin && <Shield size={12} style={{ marginRight: 4 }} />}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right: auth + burger */}
          <div className="nav2__right">
            {user ? (
              <button className="nav2__btn" onClick={signOut}>
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            ) : (
              <Link to="/login" className="nav2__btn nav2__btn--primary">
                <LogIn size={14} />
                <span>Login</span>
              </Link>
            )}

            <button
              className="nav2__burger"
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <motion.span
                className="nav2__bline"
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="nav2__bline"
                animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="nav2__bline"
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile overlay ── */}
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
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              {links.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className={`nav2__mob-link ${activePath === link.path ? 'nav2__mob-link--active' : ''} ${link.isAdmin ? 'nav2__mob-link--admin' : ''}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="nav2__mob-num">0{i + 1}</span>
                    {link.isAdmin && <Shield size={14} style={{ marginRight: 4 }} />}
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <div className="nav2__mob-divider" />

              {user ? (
                <button className="nav2__mob-auth" onClick={() => { signOut(); setMobileOpen(false); }}>
                  <LogOut size={15} /> Logout
                </button>
              ) : (
                <Link to="/login" className="nav2__mob-auth nav2__mob-auth--primary" onClick={() => setMobileOpen(false)}>
                  <LogIn size={15} /> Login
                </Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

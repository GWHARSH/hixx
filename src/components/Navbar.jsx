import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Uploads', path: '/uploads' },
  { name: 'Packages', path: '/packages' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const { user, signOut } = useAuth();
  const location = useLocation();
  const pillRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const updateIndicator = useCallback(() => {
    if (!pillRef.current) return;
    const active = pillRef.current.querySelector('.nav2__link--active');
    if (!active) { setIndicator(s => ({ ...s, opacity: 0 })); return; }
    const pr = pillRef.current.getBoundingClientRect();
    const ar = active.getBoundingClientRect();
    setIndicator({ left: ar.left - pr.left, width: ar.width, opacity: 1 });
  }, []);

  useEffect(() => {
    // Small delay so the link renders first
    const t = setTimeout(updateIndicator, 20);
    window.addEventListener('resize', updateIndicator, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('resize', updateIndicator); };
  }, [location.pathname, updateIndicator]);

  const links = user?.role === 'admin'
    ? [...NAV_LINKS, { name: 'Admin', path: '/admin' }]
    : NAV_LINKS;

  return (
    <>
      {/* ── Desktop / tablet ── */}
      <nav className={`nav2 ${scrolled ? 'nav2--scrolled' : ''}`} aria-label="Main navigation">
        <div className="nav2__bar">

          {/* Logo */}
          <Link to="/" className="nav2__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="nav2__logo-white">HIXX</span>
            <span className="nav2__logo-pink">PLAYZ</span>
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
                className={`nav2__link ${location.pathname === link.path ? 'nav2__link--active' : ''}`}
              >
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
                    className={`nav2__mob-link ${location.pathname === link.path ? 'nav2__mob-link--active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="nav2__mob-num">0{i + 1}</span>
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

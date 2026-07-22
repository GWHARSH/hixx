import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, Key, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretInput, setSecretInput] = useState('');
  const [secretError, setSecretError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, isUnlocked, unlockSecret } = useAuth();
  const navigate = useNavigate();

  const handleMagicSubmit = (e) => {
    e.preventDefault();
    const val = secretInput.trim().toUpperCase();
    if (val === 'PHEONIX' || val === 'PHOENIX' || val === 'IMMORTAL') {
      unlockSecret();
      setSecretError('');
    } else {
      setSecretError('Incorrect Magic Word. Hint: PHEONIX');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate('/');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <main className="login-page">
      <div className="login-page__bg-orb login-page__bg-orb--1" />
      <div className="login-page__bg-orb login-page__bg-orb--2" />

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="secret-lock"
            className="login-card"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '20px',
              background: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: 'var(--accent)',
              boxShadow: '0 0 30px rgba(0, 240, 255, 0.2)'
            }}>
              <Key size={28} />
            </div>

            <div className="login-card__header">
              <h1 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Restricted Access</h1>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Type the magic word <strong style={{ color: 'var(--accent)' }}>"PHEONIX"</strong> anywhere on screen or enter it below to reveal login.
              </p>
            </div>

            <form className="login-card__form" onSubmit={handleMagicSubmit}>
              <div className="input-group">
                <Sparkles size={18} className="input-group__icon" />
                <input
                  type="text"
                  placeholder="Enter Magic Word (e.g. PHEONIX)"
                  value={secretInput}
                  data-allow-magic="true"
                  onChange={(e) => {
                    setSecretInput(e.target.value);
                    if (e.target.value.trim().toUpperCase() === 'PHEONIX' || e.target.value.trim().toUpperCase() === 'PHOENIX') {
                      unlockSecret();
                    }
                  }}
                  autoFocus
                />
              </div>

              {secretError && <div className="login-card__error">{secretError}</div>}

              <button
                type="submit"
                className="btn btn--primary btn--lg btn--full"
              >
                <Key size={18} /> Unlock Login Form
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="login-form"
            className="login-card"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <div className="login-card__header">
              <h1>Admin Sign In</h1>
              <p>Sign in to your administrative account</p>
            </div>

            <form className="login-card__form" onSubmit={handleSubmit}>
              <div className="input-group">
                <Mail size={18} className="input-group__icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <Lock size={18} className="input-group__icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="input-group__toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && <div className="login-card__error">{error}</div>}

              <button
                type="submit"
                className="btn btn--primary btn--lg btn--full"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner" />
                ) : (
                  <>
                    <LogIn size={18} /> Sign In
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

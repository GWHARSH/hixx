import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import PremiumLoader from '../components/PremiumLoader';
import Notification from '../components/Notification';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Clear any legacy persistent flags on startup so login button is strictly HIDDEN until typed
  useEffect(() => {
    localStorage.removeItem('secret_login_unlocked');
    sessionStorage.removeItem('secret_login_unlocked');
  }, []);

  // Global Magic Word Listener ("PHEONIX" or "PHOENIX")
  useEffect(() => {
    let keyBuffer = '';

    const handleKeyDown = (e) => {
      // Ignore if user is typing inside an input/textarea
      const targetTag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
      const isInput = targetTag === 'input' || targetTag === 'textarea' || e.target.isContentEditable;
      
      if (isInput && !e.target.dataset.allowMagic) return;

      if (e.key && e.key.length === 1) {
        keyBuffer += e.key.toUpperCase();
        if (keyBuffer.length > 20) {
          keyBuffer = keyBuffer.slice(-20);
        }

        if (
          keyBuffer.includes('PHEONIX') || 
          keyBuffer.includes('PHOENIX') || 
          keyBuffer.includes('IMMORTAL')
        ) {
          setIsUnlocked(true);
          setToastMessage('🔓 Secret Protocol Accepted: Login Button Unlocked!');
          keyBuffer = '';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      if (loading) setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(timeout);
      if (firebaseUser) {
        try {
          let role = 'user';
          const ADMIN_EMAILS = ['hixx@playz.com'];
          if (ADMIN_EMAILS.includes(firebaseUser.email?.toLowerCase())) {
            role = 'admin';
          } else if (db) {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              role = userDoc.data().role || 'user';
            }
          }
          setUser({ ...firebaseUser, role });
          setIsUnlocked(true);
        } catch {
          const ADMIN_EMAILS = ['hixx@playz.com'];
          const fallbackRole = ADMIN_EMAILS.includes(firebaseUser.email?.toLowerCase()) ? 'admin' : 'user';
          setUser({ ...firebaseUser, role: fallbackRole });
          setIsUnlocked(true);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signIn = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      return { data: null, error: new Error('Firebase not configured') };
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { data: result, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    if (auth) await firebaseSignOut(auth);
    setIsUnlocked(false);
    localStorage.removeItem('secret_login_unlocked');
    sessionStorage.removeItem('secret_login_unlocked');
  };

  const unlockSecret = () => {
    setIsUnlocked(true);
    setToastMessage('🔓 Secret Protocol Accepted: Login Button Unlocked!');
  };

  const value = { user, signIn, signOut, isUnlocked, unlockSecret };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050508' }}>
          <PremiumLoader text="Synchronizing System Protocol" size="lg" />
        </div>
      ) : (
        <>
          {children}
          {toastMessage && (
            <div className="notification-container">
              <Notification
                message={toastMessage}
                type="success"
                onClose={() => setToastMessage(null)}
              />
            </div>
          )}
        </>
      )}
    </AuthContext.Provider>
  );
}

import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import PremiumLoader from '../components/PremiumLoader';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
          // Admin email fallback — guarantees admin access even if Firestore rules block reads
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
        } catch {
          // Still check email even on error
          const ADMIN_EMAILS = ['hixx@playz.com'];
          const fallbackRole = ADMIN_EMAILS.includes(firebaseUser.email?.toLowerCase()) ? 'admin' : 'user';
          setUser({ ...firebaseUser, role: fallbackRole });
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
  };

  const value = { user, signIn, signOut };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050508' }}>
          <PremiumLoader text="Synchronizing System Protocol" size="lg" />
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}

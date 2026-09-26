import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  type Auth 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  type Firestore 
} from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

// Default Firebase Live Config for Dio Talk
const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: "AIzaSyB-LDoEx0W5QSBCNU_UE3PZqHd3y6qKBAw",
  authDomain: "studio-xdudz.firebaseapp.com",
  projectId: "studio-xdudz",
  storageBucket: "studio-xdudz.firebasestorage.app",
  messagingSenderId: "363348105015",
  appId: "1:363348105015:web:e704e03a18d2a268e2acb2"
};

export const getStoredFirebaseConfig = (): FirebaseConfig => {
  const saved = localStorage.getItem('dio_firebase_config');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && !parsed.apiKey.includes('Demo')) {
        return parsed;
      }
    } catch (e) {
      console.error('Invalid saved firebase config', e);
    }
  }
  return DEFAULT_FIREBASE_CONFIG;
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
const googleProvider = new GoogleAuthProvider();

export const initFirebase = (config?: FirebaseConfig) => {
  try {
    const finalConfig = config || getStoredFirebaseConfig();
    if (!getApps().length) {
      app = initializeApp(finalConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
    return { app, auth, db };
  } catch (error) {
    console.warn('Firebase init warning:', error);
    return { app: null, auth: null, db: null };
  }
};

// Initialize immediately
initFirebase();

export const isFirebaseLive = (): boolean => {
  const cfg = getStoredFirebaseConfig();
  return !cfg.apiKey.includes('Demo');
};

export const getFirebaseDb = (): Firestore | null => {
  if (!db) initFirebase();
  return db;
};

import { Capacitor } from '@capacitor/core';

/**
 * Sign in with Google (In-app native on Android, or Popup on Web)
 */
export const signInWithGoogleFirebase = async (customEmail?: string, customName?: string) => {
  // If running inside Android APK (Native platform), do NOT trigger browser redirect/popup
  const isNativeApp = Capacitor.isNativePlatform() || 
                      (window as any).Capacitor?.isNativePlatform?.() ||
                      window.location.protocol === 'capacitor:';

  if (isNativeApp) {
    const rawEmail = customEmail || localStorage.getItem('dio_saved_email') || 'thuyenvien@diotalk.vn';
    const rawName = customName || localStorage.getItem('dio_saved_name') || 'Thuyền viên Dio Talk';
    const cleanId = rawEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const uid = 'app_' + cleanId;

    const profileData = {
      uid,
      name: rawName,
      email: rawEmail,
      photoURL: '',
      lastLogin: new Date().toISOString()
    };

    if (db) {
      try {
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, profileData, { merge: true });
      } catch (dbErr) {
        console.warn('Firestore write warning:', dbErr);
      }
    }
    return profileData;
  }

  // Web Browser environment:
  if (!auth) initFirebase();
  if (!auth) throw new Error('Firebase Auth chưa được khởi tạo');

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const profileData = {
      uid: user.uid,
      name: user.displayName || 'Thuyền viên',
      email: user.email || 'mariner@diotalk.vn',
      photoURL: user.photoURL || '',
      lastLogin: new Date().toISOString()
    };

    // Save to Firestore if db is active
    if (db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, profileData, { merge: true });
      } catch (dbErr) {
        console.warn('Firestore write warning:', dbErr);
      }
    }

    return profileData;
  } catch (err: any) {
    console.error('Google Sign-In Error:', err);
    throw err;
  }
};

/**
 * Save user profile to Firestore Cloud Database
 */
export const saveProfileToCloud = async (uid: string, profile: any) => {
  if (!db) return;
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    console.warn('Failed to save profile to Firestore:', e);
  }
};

/**
 * Fetch user profile from Firestore Cloud Database
 */
export const getProfileFromCloud = async (uid: string) => {
  if (!db) return null;
  try {
    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
  } catch (e) {
    console.warn('Failed to get profile from Firestore:', e);
  }
  return null;
};

/**
 * Sync lesson progress to Firestore
 */
export const syncProgressToCloud = async (uid: string, progress: {
  completedTerms: number;
  streakDays: number;
  xp: number;
  hearts: number;
  accuracyScore: number;
}) => {
  if (!db) return;
  try {
    const progressRef = doc(db, 'users', uid, 'data', 'progress');
    await setDoc(progressRef, {
      ...progress,
      lastSyncedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    console.warn('Failed to sync progress to cloud:', e);
  }
};

/**
 * Sign out of Firebase
 */
export const signOutFirebase = async () => {
  if (auth) {
    await signOut(auth);
  }
};

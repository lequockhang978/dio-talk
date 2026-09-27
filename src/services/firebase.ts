import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  type User,
  type Auth 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  getDocs,
  query,
  limit,
  onSnapshot,
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

/**
 * Sign in with Google (In-app native on Android, or Popup on Web)
 */
export const signInWithGoogleFirebase = async () => {
  if (!auth) initFirebase();
  if (!auth) throw new Error('Firebase Auth chưa được khởi tạo');

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const profileData = {
      uid: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'Thuyền viên',
      email: user.email || 'thuyenvien@gmail.com',
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
 * Full user cloud progress structure
 */
export interface FullUserProgress {
  name: string;
  email: string;
  department: 'engine' | 'deck';
  rank: string;
  streakDays: number;
  hearts: number;
  xp: number;
  coins: number;
  unlockedNodeIds: string[];
  starsMap: Record<string, number>;
  masteredWords: string[];
  completedToday: number;
  lessonSessions?: Record<string, number>;
}

/**
 * Save complete user progress to Firestore
 */
export const saveUserFullProgressToCloud = async (uid: string, data: Partial<FullUserProgress>) => {
  if (!db) initFirebase();
  if (!db) return;
  try {
    const cleanId = (uid || 'anon').replace(/[^a-zA-Z0-9_-]/g, '_');
    const userRef = doc(db, 'users', cleanId);
    const payload = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    await setDoc(userRef, payload, { merge: true });

    // Also sync to leaderboard
    if (data.name) {
      await syncUserToLeaderboard({
        uid: cleanId,
        name: data.name,
        rank: data.rank || 'Thợ máy (Motorman)',
        ship: 'M/V Ocean Pioneer',
        avatar: data.name.charAt(0).toUpperCase() || 'U',
        avatarBg: '#2563EB',
        streak: Number(data.streakDays) || 1,
        vocab: data.masteredWords ? data.masteredWords.length : 0,
        xp: Number(data.xp) || 100,
        email: data.email || '',
        department: data.department || 'engine'
      });
    }
  } catch (e) {
    console.warn('Failed to save full progress to cloud:', e);
  }
};

/**
 * Load complete user progress from Firestore
 */
export const loadUserFullProgressFromCloud = async (uid: string): Promise<FullUserProgress | null> => {
  if (!db) initFirebase();
  if (!db) return null;
  try {
    const cleanId = (uid || 'anon').replace(/[^a-zA-Z0-9_-]/g, '_');
    const userRef = doc(db, 'users', cleanId);
    let snap = await getDoc(userRef);
    let data: any = snap.exists() ? snap.data() : null;

    if (!data) {
      const lbRef = doc(db, 'leaderboard', cleanId);
      const lbSnap = await getDoc(lbRef);
      if (lbSnap.exists()) {
        data = lbSnap.data();
      }
    }

    if (data) {
      return {
        name: data.name || 'Thuyền viên',
        email: data.email || '',
        department: (data.department === 'deck' ? 'deck' : 'engine'),
        rank: data.rank || (data.department === 'deck' ? 'Thủy thủ lái (Helmsman / AB)' : 'Thợ máy (Motorman)'),
        streakDays: Number(data.streakDays ?? data.streak) || 0,
        hearts: Number(data.hearts) || 5,
        xp: Number(data.xp) || 0,
        coins: Number(data.coins) || 100,
        unlockedNodeIds: Array.isArray(data.unlockedNodeIds) ? data.unlockedNodeIds : [],
        starsMap: (data.starsMap && typeof data.starsMap === 'object') ? data.starsMap : {},
        masteredWords: Array.isArray(data.masteredWords) ? data.masteredWords : [],
        completedToday: Number(data.completedToday) || 0,
        lessonSessions: (data.lessonSessions && typeof data.lessonSessions === 'object') ? data.lessonSessions : {}
      };
    }
  } catch (e) {
    console.warn('Failed to load full user progress from cloud:', e);
  }
  return null;
};

export const subscribeToAuthState = (onChange: (user: User | null) => void) => {
  if (!auth) initFirebase();
  return auth ? onAuthStateChanged(auth, onChange) : () => {};
};

export const getCurrentUserId = (): string | null => auth?.currentUser?.uid ?? null;

export const signOutFirebase = async () => {
  if (auth) {
    await signOut(auth);
  }
};

export interface CloudLeaderboardUser {
  uid: string;
  name: string;
  rank: string;
  ship: string;
  avatar?: string;
  avatarBg?: string;
  streak: number;
  vocab: number;
  xp?: number;
  email?: string;
  department?: 'engine' | 'deck';
  updatedAt?: string;
  isCurrentUser?: boolean;
}

// ONLY 100% REAL USERS FROM FIRESTORE - NO FAKE / BENCHMARK DATA

/**
 * Sync active user's streak and mastered vocab directly to Firestore Cloud Leaderboard
 */
export const syncUserToLeaderboard = async (user: CloudLeaderboardUser) => {
  if (!db) initFirebase();
  if (!db) return;

  try {
    const rawId = user.uid || user.email || 'anon_user';
    const cleanId = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const docRef = doc(db, 'leaderboard', cleanId);

    const payload = {
      uid: cleanId,
      name: user.name || 'Thuyền viên',
      rank: user.rank || 'Sĩ quan',
      ship: user.ship || 'M/V Ocean Pioneer',
      avatar: user.avatar || user.name.charAt(0).toUpperCase() || 'U',
      avatarBg: user.avatarBg || '#2563EB',
      streak: Number(user.streak) || 1,
      vocab: Number(user.vocab) || 0,
      xp: Number(user.xp) || 100,
      email: user.email || '',
      department: user.department || 'engine',
      updatedAt: new Date().toISOString()
    };

    await setDoc(docRef, payload, { merge: true });

    // Also update main user doc
    const userDocRef = doc(db, 'users', cleanId);
    await setDoc(userDocRef, {
      streak: payload.streak,
      vocab: payload.vocab,
      xp: payload.xp,
      rank: payload.rank,
      name: payload.name,
      updatedAt: payload.updatedAt
    }, { merge: true });

  } catch (err) {
    console.warn('Leaderboard sync to Firebase Cloud error:', err);
    throw err;
  }
};

/**
 * Fetch 100% real leaderboard records directly from Firestore Cloud collections ('leaderboard' and 'users')
 */
export const fetchRealLeaderboard = async (): Promise<CloudLeaderboardUser[]> => {
  if (!db) initFirebase();

  const resultMap = new Map<string, CloudLeaderboardUser>();

  if (db) {
    // 1. Fetch real users from 'leaderboard' collection in Firestore
    try {
      const q = query(collection(db, 'leaderboard'), limit(100));
      const snap = await getDocs(q);
      snap.forEach(d => {
        const data = d.data() as any;
        if (data && (data.name || data.email)) {
          resultMap.set(d.id, {
            uid: d.id,
            name: data.name || (data.email ? data.email.split('@')[0] : 'Thuyền viên'),
            rank: data.rank || 'Sĩ quan',
            ship: data.ship || 'M/V Ocean Pioneer',
            avatar: data.avatar || (data.name ? data.name.charAt(0).toUpperCase() : 'U'),
            avatarBg: data.avatarBg || '#3B82F6',
            streak: Number(data.streak || data.streakDays || 1),
            vocab: Number(data.vocab || data.completedTerms || 0),
            xp: Number(data.xp || 100),
            email: data.email || '',
            department: data.department || 'engine',
            updatedAt: data.updatedAt
          });
        }
      });
    } catch (e) {
      console.warn('Error fetching leaderboard collection:', e);
    }

    // 2. Fetch real users from 'users' collection in Firestore
    try {
      const uq = query(collection(db, 'users'), limit(100));
      const uSnap = await getDocs(uq);
      uSnap.forEach(d => {
        const data = d.data() as any;
        if (data && (data.name || data.email || data.displayName)) {
          const uid = d.id;
          const name = data.name || data.displayName || (data.email ? data.email.split('@')[0] : 'Thuyền viên');
          const existing = resultMap.get(uid);
          if (!existing) {
            resultMap.set(uid, {
              uid,
              name,
              rank: data.rank || 'Sĩ quan',
              ship: data.ship || 'Tàu viễn dương',
              avatar: data.photoURL || name.charAt(0).toUpperCase() || 'U',
              avatarBg: '#2563EB',
              streak: Number(data.streak || data.streakDays || 1),
              vocab: Number(data.vocab || data.completedTerms || 0),
              xp: Number(data.xp || 100),
              email: data.email || '',
              department: data.department || 'engine',
              updatedAt: data.updatedAt || data.lastLogin
            });
          } else {
            if (!existing.email && data.email) existing.email = data.email;
            if (data.rank && (!existing.rank || existing.rank === 'Sĩ quan')) existing.rank = data.rank;
          }
        }
      });
    } catch (uErr) {
      console.warn('Error fetching users collection for leaderboard:', uErr);
    }
  }

  const list = Array.from(resultMap.values());
  try {
    localStorage.setItem('dio_cached_leaderboard', JSON.stringify(list));
  } catch (_) {}

  return list;
};

/**
 * Real-time listener for Firestore Leaderboard
 */
export const subscribeToRealLeaderboard = (
  onUpdate: (users: CloudLeaderboardUser[]) => void
) => {
  if (!db) initFirebase();
  if (!db) return () => {};

  try {
    return onSnapshot(collection(db, 'leaderboard'), () => {
      fetchRealLeaderboard().then(onUpdate);
    }, (err) => {
      console.warn('Leaderboard onSnapshot error:', err);
    });
  } catch (err) {
    console.warn('Subscribe error:', err);
    return () => {};
  }
};


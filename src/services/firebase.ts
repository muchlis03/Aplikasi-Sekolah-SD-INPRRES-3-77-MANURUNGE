import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  getDocFromServer,
  Firestore
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { SchoolInfo, Student, AttendanceMap, GradeMap } from '../types';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth & Firestore with the provisioned database ID
export const auth = getAuth(app);
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Google Login Provider
export async function loginWithGoogle(): Promise<FirebaseUser> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  
  // Persist user profile to Firestore
  if (result.user) {
    const user = result.user;
    const profilePath = `users/${user.uid}/profile/info`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'profile', 'info'), {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn("Could not write profile to cloud:", e);
    }
  }

  return result.user;
}

export async function logout(): Promise<void> {
  await firebaseSignOut(auth);
}

// Subscribe to real-time user data document with error handling
export function subscribeToUserData<T>(
  userId: string,
  docName: string,
  onData: (data: T) => void,
  onError?: (err: any) => void
): () => void {
  const docRef = doc(db, 'users', userId, 'appData', docName);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        onData(snap.data() as T);
      }
    },
    (error) => {
      console.error(`Error subscribing to ${docName}:`, error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, `users/${userId}/appData/${docName}`);
    }
  );
}

// Save user data to Firestore with atomic timestamps
export async function saveUserData(
  userId: string,
  docName: string,
  data: any
): Promise<void> {
  const path = `users/${userId}/appData/${docName}`;
  try {
    const payload = {
      ...data,
      _lastModified: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', userId, 'appData', docName), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Test connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.warn("Firestore client is offline, using offline cache & local storage.");
      return false;
    }
    // Any other response means we connected to the server
    return true;
  }
}

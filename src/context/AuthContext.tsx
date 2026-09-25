import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  FirebaseUser 
} from '../lib/firebase';
import { firestoreService, FirestoreUserProfile } from '../services/firestoreService';
import { UserRole, getEffectiveRole } from '../lib/rbac';

export interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: FirestoreUserProfile | null;
  userRole: UserRole;
  isLoggedIn: boolean;
  isLoading: boolean;
  loading: boolean;
  authError: string | null;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signupWithEmail: (email: string, pass: string, name: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  loginDemo: (role: 'member' | 'associate' | 'admin', username?: string) => void;
  logout: () => Promise<{ success: boolean; error?: string }>;
  updateRole: (newRole: UserRole) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<FirestoreUserProfile | null>(null);
  const [demoRole, setDemoRole] = useState<UserRole | null>(null);
  const [demoName, setDemoName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearError = () => setAuthError(null);

  // Initialize DB Seeds on load safely without blocking UI rendering
  useEffect(() => {
    firestoreService.seedDatabaseIfEmpty().catch(() => {});
  }, []);

  // Strict native Firebase Auth Persistence via onAuthStateChanged
  // (Zero manual localStorage token synchronization)
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(
      auth, 
      async (user) => {
        if (!isMounted) return;
        setIsLoading(true);
        setAuthError(null);
        try {
          if (user) {
            setCurrentUser(user);
            // Fetch user profile from Firestore
            let profile = await firestoreService.getUserProfile(user.uid);
            if (!profile) {
              const defaultRole: UserRole = 'member';
              profile = {
                uid: user.uid,
                email: user.email || '',
                name: user.displayName || user.email?.split('@')[0] || 'User',
                role: defaultRole,
                createdAt: new Date().toISOString(),
                photoURL: user.photoURL || undefined,
              };
              await firestoreService.saveUserProfile(profile);
            }
            if (isMounted) {
              setUserProfile(profile);
              setDemoRole(null);
            }
          } else {
            if (isMounted) {
              setCurrentUser(null);
              setUserProfile(null);
            }
          }
        } catch (err: any) {
          console.error('[AuthContext:StateObserverError]:', err?.message || err);
          if (isMounted) {
            setAuthError(err?.message || 'Failed to sync authentication profile.');
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      },
      (error) => {
        if (!isMounted) return;
        console.error('[AuthContext:FirebaseObserverError]:', error);
        setAuthError(error.message);
        setIsLoading(false);
      }
    );

    // Full lifecycle cleanup to prevent memory leaks in production
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Calculate effective role based on authenticated profile
  let effectiveRole: UserRole = 'guest';
  let isEffectiveLoggedIn = false;

  if (demoRole) {
    effectiveRole = demoRole;
    isEffectiveLoggedIn = true;
  } else if (currentUser && userProfile) {
    effectiveRole = getEffectiveRole(true, userProfile.role);
    isEffectiveLoggedIn = true;
  }

  // Google Sign-In with popup
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      let profile = await firestoreService.getUserProfile(user.uid);
      if (!profile) {
        profile = {
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || 'Google User',
          role: 'member',
          createdAt: new Date().toISOString(),
          photoURL: user.photoURL || undefined,
        };
        await firestoreService.saveUserProfile(profile);
      }
      setUserProfile(profile);
      setDemoRole(null);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      const errorMsg = err?.message || 'Google sign-in could not be completed';
      console.error('[AuthContext:LoginWithGoogleError]:', err);
      setAuthError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  // Standard Email & Password Sign-In
  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      const profile = await firestoreService.getUserProfile(result.user.uid);
      if (profile) setUserProfile(profile);
      setDemoRole(null);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      const errorMsg = err?.message || 'Invalid email or password';
      console.error('[AuthContext:LoginWithEmailError]:', err);
      setAuthError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  // Sign Up with Email & Password
  const signupWithEmail = async (
    email: string, 
    pass: string, 
    name: string, 
    role: UserRole = 'member'
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      const newProfile: FirestoreUserProfile = {
        uid: result.user.uid,
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
      };
      await firestoreService.saveUserProfile(newProfile);
      setUserProfile(newProfile);
      setDemoRole(null);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      const errorMsg = err?.message || 'Registration failed';
      console.error('[AuthContext:SignupWithEmailError]:', err);
      setAuthError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  // Demo Role Switcher for preview walkthroughs
  const loginDemo = (role: 'member' | 'associate' | 'admin', username?: string) => {
    setDemoRole(role);
    setDemoName(username || (role === 'admin' ? 'Administrator' : role === 'associate' ? 'Associate Partner' : 'Registered Member'));
  };

  // Standard Firebase Sign-Out
  const logout = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      if (currentUser) {
        await signOut(auth);
      }
      setDemoRole(null);
      setDemoName(null);
      setUserProfile(null);
      setCurrentUser(null);
      setIsLoading(false);
      return { success: true };
    } catch (e: any) {
      const errorMsg = e?.message || 'Sign out encountered an issue';
      console.error('[AuthContext:LogoutError]:', e);
      setAuthError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  // Update Role in active session
  const updateRole = async (newRole: UserRole) => {
    try {
      if (currentUser && userProfile) {
        await firestoreService.updateUserRole(currentUser.uid, newRole);
        setUserProfile({ ...userProfile, role: newRole });
      } else if (demoRole) {
        setDemoRole(newRole);
      }
    } catch (e: any) {
      console.error('[AuthContext:UpdateRoleError]:', e);
      setAuthError(e?.message || 'Failed to update user role');
    }
  };

  const contextValue = useMemo(() => ({
    currentUser,
    userProfile,
    userRole: effectiveRole,
    isLoggedIn: isEffectiveLoggedIn,
    isLoading,
    loading: isLoading,
    authError,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    loginDemo,
    logout,
    updateRole,
    clearError,
  }), [currentUser, userProfile, effectiveRole, isEffectiveLoggedIn, isLoading, authError, demoRole, demoName]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;


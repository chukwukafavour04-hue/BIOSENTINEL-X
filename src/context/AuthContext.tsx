import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/seedData';
import { auth, signInWithGooglePopup, signOutCurrentUser, onAuthStateChanged } from '../lib/firebase';
import { User } from 'firebase/auth';

interface AuthContextType {
  currentUser: UserProfile;
  firebaseUser: User | null;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  switchPersona: (role: UserRole) => void;
  canEditModule: (moduleName: 'zoonotic' | 'environmental' | 'vector' | 'investigation') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Incident Commander for comprehensive demo capabilities
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('biosentinel_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEMO_USERS[0];
  });

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        // Map Firebase user to a profile if not already custom
        const isCurrentGovEmail = currentUser.email.endsWith('.gov.ng') || currentUser.email.endsWith('.org');
        if (!isCurrentGovEmail || currentUser.email === 'chukwukafavour04@gmail.com') {
          const profile: UserProfile = {
            uid: user.uid,
            displayName: user.displayName || 'Authorized Officer',
            email: user.email || 'officer@onehealth.gov.ng',
            role: user.email === 'chukwukafavour04@gmail.com' ? 'incident_commander' : 'epidemiologist',
            stateJurisdiction: 'National',
            facility: 'Federal Ministry of Health Sentinel Station',
            agency: 'One Health Joint Taskforce',
          };
          setCurrentUser(profile);
          localStorage.setItem('biosentinel_user_profile', JSON.stringify(profile));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const switchPersona = (role: UserRole) => {
    const target = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setCurrentUser(target);
    localStorage.setItem('biosentinel_user_profile', JSON.stringify(target));
  };

  const loginWithGoogle = async () => {
    try {
      const user = await signInWithGooglePopup();
      const profile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || 'Federal Health Official',
        email: user.email || 'official@health.gov.ng',
        role: user.email === 'chukwukafavour04@gmail.com' ? 'incident_commander' : 'epidemiologist',
        stateJurisdiction: 'National',
        facility: 'National Surveillance Command Center',
        agency: 'Federal Ministry of Health & Social Welfare',
      };
      setCurrentUser(profile);
      localStorage.setItem('biosentinel_user_profile', JSON.stringify(profile));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOutCurrentUser();
    switchPersona('incident_commander');
  };

  // Role-based permissions matrix
  const canEditModule = (moduleName: 'zoonotic' | 'environmental' | 'vector' | 'investigation'): boolean => {
    if (currentUser.role === 'incident_commander') return true;
    if (currentUser.role === 'researcher_observer') return false; // Read-only

    if (moduleName === 'zoonotic') {
      return currentUser.role === 'epidemiologist' || currentUser.role === 'veterinary_officer';
    }
    if (moduleName === 'environmental') {
      return currentUser.role === 'environmental_officer' || currentUser.role === 'veterinary_officer';
    }
    if (moduleName === 'vector') {
      return (
        currentUser.role === 'epidemiologist' ||
        currentUser.role === 'environmental_officer' ||
        currentUser.role === 'veterinary_officer'
      );
    }
    if (moduleName === 'investigation') {
      return (
        currentUser.role === 'epidemiologist' ||
        currentUser.role === 'veterinary_officer'
      );
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isAuthenticated: !!firebaseUser || !!currentUser,
        loginWithGoogle,
        logout,
        switchPersona,
        canEditModule,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

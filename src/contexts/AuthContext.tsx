import { createContext, useContext, useEffect, useState } from "react";
import * as SQLite from '../database/sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';

// Simple password hashing function (in production, use a proper library)
const hashPassword = (password: string): string => {
  // This is a simple hash for demonstration - use a proper library like bcrypt in production
  return btoa(password).split('').reverse().join('');
};

// User and Session types to replace Supabase types
interface LocalUser {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  created_at: string;
  updated_at: string;
  password_hash?: string;
}

interface LocalSession {
  id: string;
  user_id: string;
  expires_at: string;
  created_at: string;
}

interface AuthContextType {
  user: LocalUser | null;
  session: LocalSession | null;
  loading: boolean;
  role: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [session, setSession] = useState<LocalSession | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        // Clear any existing state first
        setUser(null);
        setSession(null);
        setRole(null);
        
        const sessionId = await AsyncStorage.getItem('currentSessionId');
        if (sessionId) {
          const sessionData: any = await SQLite.getSessionById(sessionId);
          if (sessionData) {
            setSession(sessionData as LocalSession);
            
            // Get user data
            const userData: any = await SQLite.getUserById(sessionData.user_id);
            if (userData) {
              setUser(userData as LocalUser);
              setRole(userData.role || null);
            }
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Clear any potentially corrupted state
        await AsyncStorage.removeItem('currentSessionId');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Clear any existing state first
      setUser(null);
      setSession(null);
      setRole(null);
      
      // Hash the provided password for comparison
      const hashedPassword = hashPassword(password);
      
      // Find user by email
      const userData: any = await SQLite.getUserByEmail(email);
      
      if (!userData) {
        throw new Error('Invalid email or password');
      }
      
      // Check password
      if (userData.password_hash !== hashedPassword) {
        throw new Error('Invalid email or password');
      }
      
      // Create session
      const sessionId = randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Session expires in 7 days
      
      const sessionData = {
        id: sessionId,
        userId: userData.id,
        expiresAt: expiresAt
      };
      
      await SQLite.createSession(sessionData);
      
      // Store session ID in AsyncStorage
      await AsyncStorage.setItem('currentSessionId', sessionId);
      
      // Set state
      setUser(userData as LocalUser);
      setRole(userData.role || null);
      
      const sessionResult: LocalSession = {
        id: sessionId,
        user_id: userData.id,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      };
      
      setSession(sessionResult);
    } catch (error) {
      // Clear state on error
      setUser(null);
      setSession(null);
      setRole(null);
      await AsyncStorage.removeItem('currentSessionId');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    try {
      // Clear any existing state first
      setUser(null);
      setSession(null);
      setRole(null);
      await AsyncStorage.removeItem('currentSessionId');
      
      // Check if user already exists
      const existingUser: any = await SQLite.getUserByEmail(email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }
      
      // For growers and technicians, check if they're pre-approved
      if (role === 'grower' || role === 'technician') {
        // Check if the email exists in the growers table
        const approvedGrower: any = await SQLite.getGrowerByEmail(email);
        if (!approvedGrower) {
          throw new Error(`Email ${email} is not approved for ${role} registration. Please contact an administrator.`);
        }
      }
      
      // Hash password
      const hashedPassword = hashPassword(password);
      
      // Create user
      const userId = randomUUID();
      const userData = {
        id: userId,
        email,
        passwordHash: hashedPassword,
        fullName,
        role
      };
      
      await SQLite.createUser(userData);
      
      // Automatically sign in the user
      await signIn(email, password);
    } catch (error) {
      // Clear state on error
      setUser(null);
      setSession(null);
      setRole(null);
      await AsyncStorage.removeItem('currentSessionId');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (session) {
        await SQLite.deleteSession(session.id);
      }
      await AsyncStorage.removeItem('currentSessionId');
      setUser(null);
      setSession(null);
      setRole(null);
    } catch (error) {
      console.error('Error signing out:', error);
      // Force clear state even if there's an error
      await AsyncStorage.removeItem('currentSessionId');
      setUser(null);
      setSession(null);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, role, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
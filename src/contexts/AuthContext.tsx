import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OfflineService from '../services/offlineService';
import * as Crypto from 'expo-crypto';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: string | null;
  isOfflineMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const OFFLINE_SESSION_KEY = '@offline_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    initializeAuth();
    
    // Listen for network status changes
    const removeListener = OfflineService.addNetworkListener((isOnline) => {
      if (isOnline && isOfflineMode) {
        // Try to restore online session when back online
        restoreOnlineSession();
      }
    });

    return () => removeListener();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if online
      const isOnline = await OfflineService.checkConnection();

      if (isOnline) {
        // Try normal authentication
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSession(session);
          setUser(session?.user ?? null);
          setRole(session?.user?.user_metadata?.role ?? null);
          setIsOfflineMode(false);
          
          // Save session for offline use
          await saveOfflineSession(session);
        } else {
          // Check for offline session
          await loadOfflineSession();
        }
      } else {
        // Load offline session
        await loadOfflineSession();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Fallback to offline session
      await loadOfflineSession();
    } finally {
      setLoading(false);
    }

    // Listen for auth changes (only works when online)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setRole(session?.user?.user_metadata?.role ?? null);
      
      if (session) {
        await saveOfflineSession(session);
        setIsOfflineMode(false);
      }
    });

    return () => subscription.unsubscribe();
  };

  const saveOfflineSession = async (session: Session) => {
    try {
      await AsyncStorage.setItem(OFFLINE_SESSION_KEY, JSON.stringify({
        user: session.user,
        role: session.user.user_metadata?.role,
        savedAt: Date.now()
      }));
    } catch (error) {
      console.error('Error saving offline session:', error);
    }
  };

  const loadOfflineSession = async () => {
    try {
      const stored = await AsyncStorage.getItem(OFFLINE_SESSION_KEY);
      if (stored) {
        const { user, role } = JSON.parse(stored);
        setUser(user);
        setRole(role);
        setIsOfflineMode(true);
        console.log('📱 Loaded offline session for:', user.email);
      }
    } catch (error) {
      console.error('Error loading offline session:', error);
    }
  };

  const restoreOnlineSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setUser(session.user);
        setRole(session.user.user_metadata?.role ?? null);
        setIsOfflineMode(false);
        console.log('🌐 Restored online session');
      }
    } catch (error) {
      console.error('Error restoring online session:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const isOnline = await OfflineService.checkConnection();

    if (isOnline) {
      // Online login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setSession(data.session);
      setUser(data.user);
      setRole(data.user?.user_metadata?.role ?? null);
      setIsOfflineMode(false);
      
      // Save credentials and session for offline use
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );
      await OfflineService.saveOfflineCredentials(email, hashedPassword);
      await saveOfflineSession(data.session);
    } else {
      // Offline login - verify against stored credentials
      const storedCreds = await OfflineService.getOfflineCredentials();
      if (!storedCreds || storedCreds.email !== email) {
        throw new Error('No offline credentials found. Please connect to the internet for first login.');
      }

      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );

      if (hashedPassword !== storedCreds.encryptedPassword) {
        throw new Error('Invalid credentials');
      }

      // Load offline session
      await loadOfflineSession();
      console.log('✅ Offline login successful');
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    try {
      console.log('Attempting signup with:', { email, fullName, role });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      console.log('Signup successful:', data);
      console.log('User:', data.user);
      console.log('Session:', data.session);

      // Supabase will automatically sign in the user after signup
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        setRole(role);
      } else if (data.user && !data.session) {
        // Email confirmation required - notify user
        console.log('Email confirmation required');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    const isOnline = await OfflineService.checkConnection();
    
    if (isOnline) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }

    // Clear offline data
    await AsyncStorage.removeItem(OFFLINE_SESSION_KEY);
    await OfflineService.clearOfflineCredentials();

    setUser(null);
    setSession(null);
    setRole(null);
    setIsOfflineMode(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, role, isOfflineMode, signIn, signUp, signOut }}>
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
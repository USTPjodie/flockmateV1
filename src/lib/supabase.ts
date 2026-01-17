import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'https://mizksqfqtwmgwnxjevqi.supabase.co';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'sb_publishable_oimeq0CBdRM2lctsOIYUeQ_uYDfTHMo';

console.log('Supabase config:', { url: supabaseUrl, hasKey: !!supabaseAnonKey });

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-react-native',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Offline service for managing offline data sync and storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../lib/supabase';

const STORAGE_KEYS = {
  OFFLINE_MODE: '@offline_mode',
  SYNC_QUEUE: '@sync_queue',
  CACHED_DATA: '@cached_data',
  LAST_SYNC: '@last_sync',
  OFFLINE_CREDENTIALS: '@offline_credentials',
};

export interface SyncQueueItem {
  id: string;
  action: 'insert' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
}

export interface CachedData {
  [key: string]: {
    data: any;
    timestamp: number;
  };
}

class OfflineService {
  private static instance: OfflineService;
  private isOnline: boolean = true;
  private syncQueue: SyncQueueItem[] = [];
  private listeners: Array<(isOnline: boolean) => void> = [];
  private syncInProgress: boolean = false;

  private constructor() {
    this.initializeNetworkListener();
    this.loadSyncQueue();
  }

  static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  // Initialize network listener
  private initializeNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      console.log('📶 Network status:', this.isOnline ? 'Online' : 'Offline');
      
      // Notify listeners
      this.listeners.forEach(listener => listener(this.isOnline));
      
      // Sync when coming back online
      if (!wasOnline && this.isOnline) {
        console.log('🔄 Back online! Starting sync...');
        this.syncPendingChanges();
      }
    });
  }

  // Add network status listener
  addNetworkListener(listener: (isOnline: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Get current network status
  getNetworkStatus(): boolean {
    return this.isOnline;
  }

  // Check if online
  async checkConnection(): Promise<boolean> {
    const state = await NetInfo.fetch();
    this.isOnline = state.isConnected ?? false;
    return this.isOnline;
  }

  // === OFFLINE CREDENTIALS ===
  
  async saveOfflineCredentials(email: string, encryptedPassword: string) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_CREDENTIALS, JSON.stringify({
        email,
        encryptedPassword,
        savedAt: Date.now()
      }));
    } catch (error) {
      console.error('Error saving offline credentials:', error);
    }
  }

  async getOfflineCredentials(): Promise<{ email: string; encryptedPassword: string } | null> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_CREDENTIALS);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { email: parsed.email, encryptedPassword: parsed.encryptedPassword };
      }
    } catch (error) {
      console.error('Error getting offline credentials:', error);
    }
    return null;
  }

  async clearOfflineCredentials() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_CREDENTIALS);
    } catch (error) {
      console.error('Error clearing offline credentials:', error);
    }
  }

  // === SYNC QUEUE MANAGEMENT ===
  
  private async loadSyncQueue() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      if (stored) {
        this.syncQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading sync queue:', error);
    }
  }

  private async saveSyncQueue() {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }

  async addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp'>) {
    const queueItem: SyncQueueItem = {
      ...item,
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    this.syncQueue.push(queueItem);
    await this.saveSyncQueue();
    
    console.log('📝 Added to sync queue:', queueItem.table, queueItem.action);
    
    // Try to sync immediately if online
    if (this.isOnline) {
      this.syncPendingChanges();
    }
  }

  getSyncQueueCount(): number {
    return this.syncQueue.length;
  }

  async syncPendingChanges(): Promise<boolean> {
    if (!this.isOnline || this.syncInProgress || this.syncQueue.length === 0) {
      return false;
    }

    this.syncInProgress = true;
    console.log(`🔄 Syncing ${this.syncQueue.length} pending changes...`);

    const successfulSyncs: string[] = [];
    const failedSyncs: SyncQueueItem[] = [];

    for (const item of this.syncQueue) {
      try {
        await this.executeSyncItem(item);
        successfulSyncs.push(item.id);
        console.log('✅ Synced:', item.table, item.action);
      } catch (error) {
        console.error('❌ Failed to sync:', item.table, item.action, error);
        failedSyncs.push(item);
      }
    }

    // Remove successful syncs from queue
    this.syncQueue = failedSyncs;
    await this.saveSyncQueue();

    // Update last sync timestamp
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());

    this.syncInProgress = false;
    console.log(`✨ Sync complete! ${successfulSyncs.length} successful, ${failedSyncs.length} failed`);

    return failedSyncs.length === 0;
  }

  private async executeSyncItem(item: SyncQueueItem) {
    const { table, action, data } = item;

    switch (action) {
      case 'insert':
        const { error: insertError } = await supabase.from(table).insert(data);
        if (insertError) throw insertError;
        break;

      case 'update':
        const { id, ...updateData } = data;
        const { error: updateError } = await supabase
          .from(table)
          .update(updateData)
          .eq('id', id);
        if (updateError) throw updateError;
        break;

      case 'delete':
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('id', data.id);
        if (deleteError) throw deleteError;
        break;
    }
  }

  // === CACHED DATA MANAGEMENT ===
  
  async cacheData(key: string, data: any) {
    try {
      const cached = await this.getCachedData();
      cached[key] = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(STORAGE_KEYS.CACHED_DATA, JSON.stringify(cached));
    } catch (error) {
      console.error('Error caching data:', error);
    }
  }

  async getCachedDataByKey(key: string): Promise<any | null> {
    try {
      const cached = await this.getCachedData();
      if (cached[key]) {
        // Check if cache is still valid (24 hours)
        const ageInHours = (Date.now() - cached[key].timestamp) / (1000 * 60 * 60);
        if (ageInHours < 24) {
          return cached[key].data;
        }
      }
    } catch (error) {
      console.error('Error getting cached data:', error);
    }
    return null;
  }

  private async getCachedData(): Promise<CachedData> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_DATA);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
    return {};
  }

  async clearCache() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CACHED_DATA);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  async getLastSyncTime(): Promise<number | null> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return stored ? parseInt(stored) : null;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  }

  // === DATA FETCHING WITH CACHE ===
  
  async fetchWithCache<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    forceRefresh: boolean = false
  ): Promise<T | null> {
    // If offline, return cached data
    if (!this.isOnline) {
      console.log('📱 Offline mode: Using cached data for', key);
      return await this.getCachedDataByKey(key);
    }

    // If online and not force refresh, try cache first
    if (!forceRefresh) {
      const cached = await this.getCachedDataByKey(key);
      if (cached) {
        console.log('💾 Using cached data for', key);
        return cached;
      }
    }

    // Fetch fresh data
    try {
      console.log('🌐 Fetching fresh data for', key);
      const data = await fetchFunction();
      await this.cacheData(key, data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      // Fallback to cache on error
      return await this.getCachedDataByKey(key);
    }
  }
}

export default OfflineService.getInstance();

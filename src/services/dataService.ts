import { supabase } from '../lib/supabase';
import OfflineService from './offlineService';

// === OFFLINE-ENABLED DATA FETCHING ===

// === WRITE OPERATIONS WITH OFFLINE SUPPORT ===

// Wrapper function for create operations
const handleOfflineCreate = async (table: string, data: any, onlineCreateFn: () => Promise<any>) => {
  const isOnline = OfflineService.getNetworkStatus();
  
  if (isOnline) {
    try {
      return await onlineCreateFn();
    } catch (error) {
      // If online operation fails, queue it
      await OfflineService.addToSyncQueue({ action: 'insert', table, data });
      throw error;
    }
  } else {
    // Offline: queue the operation
    await OfflineService.addToSyncQueue({ action: 'insert', table, data });
    return data; // Return the data optimistically
  }
};

// Wrapper function for update operations
const handleOfflineUpdate = async (table: string, id: string, data: any, onlineUpdateFn: () => Promise<any>) => {
  const isOnline = OfflineService.getNetworkStatus();
  
  if (isOnline) {
    try {
      return await onlineUpdateFn();
    } catch (error) {
      // If online operation fails, queue it
      await OfflineService.addToSyncQueue({ action: 'update', table, data: { id, ...data } });
      throw error;
    }
  } else {
    // Offline: queue the operation
    await OfflineService.addToSyncQueue({ action: 'update', table, data: { id, ...data } });
    return { id, ...data }; // Return the data optimistically
  }
};

// Wrapper function for delete operations
const handleOfflineDelete = async (table: string, id: string, onlineDeleteFn: () => Promise<void>) => {
  const isOnline = OfflineService.getNetworkStatus();
  
  if (isOnline) {
    try {
      return await onlineDeleteFn();
    } catch (error) {
      // If online operation fails, queue it
      await OfflineService.addToSyncQueue({ action: 'delete', table, data: { id } });
      throw error;
    }
  } else {
    // Offline: queue the operation
    await OfflineService.addToSyncQueue({ action: 'delete', table, data: { id } });
  }
};

// Grower operations
export const createGrower = async (growerData: {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
}) => {
  const { data, error } = await supabase
    .from('growers')
    .insert({
      id: growerData.id,
      name: growerData.name,
      contact_person: growerData.contactPerson,
      phone: growerData.phone,
      email: growerData.email,
      address: growerData.address,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAllGrowers = async () => {
  return await OfflineService.fetchWithCache(
    'all_growers',
    async () => {
      const { data, error } = await supabase
        .from('growers')
        .select(`
          *,
          users(full_name, email),
          farms(name, location)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the expected format
      return data?.map(grower => ({
        ...grower,
        name: grower.farms?.name || 'Unknown Farm',
        owner: grower.users?.full_name || 'Unknown',
        location: grower.farms?.location || 'N/A',
        phone: grower.users?.email || 'N/A',
        email: grower.users?.email,
      }));
    }
  );
};

export const getGrowerById = async (id: string) => {
  const { data, error } = await supabase
    .from('growers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const getGrowerByEmail = async (email: string) => {
  // First find the user by email
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (userError && userError.code !== 'PGRST116') throw userError;
  if (!userData) return null;

  // Then find the grower record linked to this user
  const { data, error } = await supabase
    .from('growers')
    .select('*')
    .eq('user_id', userData.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
  return data;
};

export const updateGrower = async (id: string, growerData: {
  name?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
}) => {
  const updates: any = {};
  
  if (growerData.name !== undefined) updates.name = growerData.name;
  if (growerData.contactPerson !== undefined) updates.contact_person = growerData.contactPerson;
  if (growerData.phone !== undefined) updates.phone = growerData.phone;
  if (growerData.email !== undefined) updates.email = growerData.email;
  if (growerData.address !== undefined) updates.address = growerData.address;

  const { data, error } = await supabase
    .from('growers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteGrower = async (id: string) => {
  const { error } = await supabase
    .from('growers')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Cycle operations
export const createCycle = async (cycleData: {
  id: string;
  name: string;
  startDate: string;
  status?: string;
  farmerCount?: number;
  chickCount?: number;
  growerId?: string;
}) => {
  const { data, error } = await supabase
    .from('cycles')
    .insert({
      id: cycleData.id,
      name: cycleData.name,
      start_date: cycleData.startDate,
      status: cycleData.status || 'Active',
      farmer_count: cycleData.farmerCount || 0,
      chick_count: cycleData.chickCount || 0,
      grower_id: cycleData.growerId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAllCycles = async () => {
  return await OfflineService.fetchWithCache(
    'all_cycles',
    async () => {
      const { data, error } = await supabase
        .from('production_cycles')
        .select(`
          *,
          growers(id, user_id),
          farms(name, location)
        `)
        .order('start_date', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the expected format
      return data?.map(cycle => ({
        ...cycle,
        id: cycle.id,
        name: `${cycle.farms?.name || 'Unknown Farm'} - Cycle`,
        start_date: cycle.start_date,
        end_date: cycle.end_date,
        status: cycle.status === 'completed' ? 'Completed' : cycle.status === 'active' ? 'Active' : 'New',
        farmer_count: 1,
        chick_count: cycle.total_chicks || 0,
        current_birds: cycle.current_birds || 0,
        mortality_count: cycle.mortality_count || 0,
        grower_id: cycle.grower_id,
        farm_name: cycle.farms?.name,
        farm_location: cycle.farms?.location,
      }));
    }
  );
};

export const getCycleById = async (id: string) => {
  const { data, error } = await supabase
    .from('cycles')
    .select(`
      *,
      grower:growers(name)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  
  return {
    ...data,
    grower_name: data.grower?.name,
  };
};

export const getCyclesByGrowerId = async (growerId: string) => {
  return await OfflineService.fetchWithCache(
    `grower_cycles_${growerId}`,
    async () => {
      const { data, error } = await supabase
        .from('production_cycles')
        .select(`
          *,
          farms(name, location)
        `)
        .eq('grower_id', growerId)
        .order('start_date', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the expected format
      return data?.map(cycle => ({
        ...cycle,
        id: cycle.id,
        name: `${cycle.farms?.name || 'Unknown Farm'} - Cycle`,
        start_date: cycle.start_date,
        end_date: cycle.end_date,
        status: cycle.status === 'completed' ? 'Completed' : cycle.status === 'active' ? 'Active' : 'New',
        farmer_count: 1,
        chick_count: cycle.total_chicks || 0,
        current_birds: cycle.current_birds || 0,
        mortality_count: cycle.mortality_count || 0,
        farm_name: cycle.farms?.name,
        farm_location: cycle.farms?.location,
      }));
    }
  );
};

export const updateCycle = async (id: string, cycleData: {
  name?: string;
  startDate?: string;
  status?: string;
  farmerCount?: number;
  chickCount?: number;
  growerId?: string;
}) => {
  const updates: any = {};
  
  if (cycleData.name !== undefined) updates.name = cycleData.name;
  if (cycleData.startDate !== undefined) updates.start_date = cycleData.startDate;
  if (cycleData.status !== undefined) updates.status = cycleData.status;
  if (cycleData.farmerCount !== undefined) updates.farmer_count = cycleData.farmerCount;
  if (cycleData.chickCount !== undefined) updates.chick_count = cycleData.chickCount;
  if (cycleData.growerId !== undefined) updates.grower_id = cycleData.growerId;

  const { data, error } = await supabase
    .from('cycles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCycle = async (id: string) => {
  const { error } = await supabase
    .from('cycles')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Cycle activity operations
export const createCycleActivity = async (activityData: {
  id: string;
  cycleId: string;
  activityType: string;
  activityDate: string;
  details?: string;
}) => {
  const { data, error } = await supabase
    .from('cycle_activities')
    .insert({
      id: activityData.id,
      cycle_id: activityData.cycleId,
      activity_type: activityData.activityType,
      activity_date: activityData.activityDate,
      details: activityData.details,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getActivitiesByCycleId = async (cycleId: string) => {
  const { data, error } = await supabase
    .from('cycle_activities')
    .select('*')
    .eq('cycle_id', cycleId)
    .order('activity_date', { ascending: false });

  if (error) throw error;
  return data;
};

export const getActivityById = async (id: string) => {
  const { data, error } = await supabase
    .from('cycle_activities')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const updateActivity = async (id: string, activityData: {
  activityType?: string;
  activityDate?: string;
  details?: string;
}) => {
  const updates: any = {};
  
  if (activityData.activityType !== undefined) updates.activity_type = activityData.activityType;
  if (activityData.activityDate !== undefined) updates.activity_date = activityData.activityDate;
  if (activityData.details !== undefined) updates.details = activityData.details;

  const { data, error } = await supabase
    .from('cycle_activities')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteActivity = async (id: string) => {
  const { error } = await supabase
    .from('cycle_activities')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Production Cycles and Harvests
export const getProductionCycleWithDetails = async (cycleId: string) => {
  const { data, error } = await supabase
    .from('production_cycles')
    .select(`
      *,
      growers(id, user_id),
      farms(name, location, owner_id),
      harvests(*)
    `)
    .eq('id', cycleId)
    .single();

  if (error) throw error;
  return data;
};

export const getHarvestsByCycleId = async (cycleId: string) => {
  const { data, error } = await supabase
    .from('harvests')
    .select('*')
    .eq('production_cycle_id', cycleId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

export const getAllFarms = async () => {
  const { data, error } = await supabase
    .from('farms')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
};

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('full_name');

  if (error) throw error;
  return data;
};

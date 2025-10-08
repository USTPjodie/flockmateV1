import * as SQLite from 'expo-sqlite';

// Open or create database
const db = SQLite.openDatabaseSync('envirotrack.db');

// Initialize database tables
export const initDatabase = async () => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    -- Users table (already exists)
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT,
      role TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Sessions table (already exists)
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    
    -- Growers table
    CREATE TABLE IF NOT EXISTS growers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      contact_person TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Cycles table
    CREATE TABLE IF NOT EXISTS cycles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      start_date DATE NOT NULL,
      status TEXT DEFAULT 'Active',
      farmer_count INTEGER DEFAULT 0,
      chick_count INTEGER DEFAULT 0,
      grower_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (grower_id) REFERENCES growers (id) ON DELETE SET NULL
    );
    
    -- Cycle activities table
    CREATE TABLE IF NOT EXISTS cycle_activities (
      id TEXT PRIMARY KEY,
      cycle_id TEXT NOT NULL,
      activity_type TEXT NOT NULL, -- 'doc_loading', 'supply_delivery', 'harvest', etc.
      activity_date DATE NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cycle_id) REFERENCES cycles (id) ON DELETE CASCADE
    );
  `);
};

// User operations (already implemented)
export const createUser = async (userData: { 
  id: string; 
  email: string; 
  passwordHash: string; 
  fullName?: string; 
  role?: string 
}) => {
  const result = await db.runAsync(
    `INSERT INTO users (id, email, password_hash, full_name, role) 
     VALUES (?, ?, ?, ?, ?)`,
    userData.id, userData.email, userData.passwordHash, userData.fullName, userData.role
  );
  return result;
};

export const getAllUsers = async () => {
  const result = await db.getAllAsync(`SELECT id, email, full_name, role, created_at FROM users ORDER BY created_at DESC`);
  return result;
};

export const getUserByEmail = async (email: string) => {
  const result = await db.getFirstAsync(
    `SELECT * FROM users WHERE email = ?`,
    email
  );
  return result;
};

export const getUserById = async (id: string) => {
  const result = await db.getFirstAsync(
    `SELECT * FROM users WHERE id = ?`,
    id
  );
  return result;
};

export const updateUserPassword = async (userId: string, newPasswordHash: string) => {
  const result = await db.runAsync(
    `UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    newPasswordHash, userId
  );
  return result;
};

// Session operations (already implemented)
export const createSession = async (sessionData: { id: string; userId: string; expiresAt: Date }) => {
  const result = await db.runAsync(
    `INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)`,
    sessionData.id, sessionData.userId, sessionData.expiresAt.toISOString()
  );
  return result;
};

export const getSessionById = async (sessionId: string) => {
  const result = await db.getFirstAsync(
    `SELECT * FROM sessions WHERE id = ? AND expires_at > datetime('now')`,
    sessionId
  );
  return result;
};

export const deleteSession = async (sessionId: string) => {
  const result = await db.runAsync(
    `DELETE FROM sessions WHERE id = ?`,
    sessionId
  );
  return result;
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
  const result = await db.runAsync(
    `INSERT INTO growers (id, name, contact_person, phone, email, address)
     VALUES (?, ?, ?, ?, ?, ?)`,
    growerData.id, growerData.name, growerData.contactPerson, growerData.phone, growerData.email, growerData.address
  );
  return result;
};

export const getAllGrowers = async () => {
  const result = await db.getAllAsync(`SELECT * FROM growers ORDER BY name`);
  return result;
};

export const getGrowerById = async (id: string) => {
  const result = await db.getFirstAsync(`SELECT * FROM growers WHERE id = ?`, id);
  return result;
};

export const getGrowerByEmail = async (email: string) => {
  const result = await db.getFirstAsync(`SELECT * FROM growers WHERE email = ?`, email);
  return result;
};

export const updateGrower = async (id: string, growerData: {
  name?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
}) => {
  const fields = [];
  const values = [];
  
  if (growerData.name !== undefined) {
    fields.push('name = ?');
    values.push(growerData.name);
  }
  if (growerData.contactPerson !== undefined) {
    fields.push('contact_person = ?');
    values.push(growerData.contactPerson);
  }
  if (growerData.phone !== undefined) {
    fields.push('phone = ?');
    values.push(growerData.phone);
  }
  if (growerData.email !== undefined) {
    fields.push('email = ?');
    values.push(growerData.email);
  }
  if (growerData.address !== undefined) {
    fields.push('address = ?');
    values.push(growerData.address);
  }
  
  if (fields.length === 0) return null;
  
  values.push(id);
  const result = await db.runAsync(
    `UPDATE growers SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    ...values
  );
  return result;
};

export const deleteGrower = async (id: string) => {
  const result = await db.runAsync(`DELETE FROM growers WHERE id = ?`, id);
  return result;
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
  const result = await db.runAsync(
    `INSERT INTO cycles (id, name, start_date, status, farmer_count, chick_count, grower_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    cycleData.id, cycleData.name, cycleData.startDate, cycleData.status || 'Active', 
    cycleData.farmerCount || 0, cycleData.chickCount || 0, cycleData.growerId
  );
  return result;
};

export const getAllCycles = async () => {
  const result = await db.getAllAsync(
    `SELECT c.*, g.name as grower_name 
     FROM cycles c 
     LEFT JOIN growers g ON c.grower_id = g.id 
     ORDER BY c.start_date DESC`
  );
  return result;
};

export const getCycleById = async (id: string) => {
  const result = await db.getFirstAsync(
    `SELECT c.*, g.name as grower_name 
     FROM cycles c 
     LEFT JOIN growers g ON c.grower_id = g.id 
     WHERE c.id = ?`, 
    id
  );
  return result;
};

export const getCyclesByGrowerId = async (growerId: string) => {
  const result = await db.getAllAsync(
    `SELECT * FROM cycles WHERE grower_id = ? ORDER BY start_date DESC`, 
    growerId
  );
  return result;
};

export const updateCycle = async (id: string, cycleData: {
  name?: string;
  startDate?: string;
  status?: string;
  farmerCount?: number;
  chickCount?: number;
  growerId?: string;
}) => {
  const fields = [];
  const values = [];
  
  if (cycleData.name !== undefined) {
    fields.push('name = ?');
    values.push(cycleData.name);
  }
  if (cycleData.startDate !== undefined) {
    fields.push('start_date = ?');
    values.push(cycleData.startDate);
  }
  if (cycleData.status !== undefined) {
    fields.push('status = ?');
    values.push(cycleData.status);
  }
  if (cycleData.farmerCount !== undefined) {
    fields.push('farmer_count = ?');
    values.push(cycleData.farmerCount);
  }
  if (cycleData.chickCount !== undefined) {
    fields.push('chick_count = ?');
    values.push(cycleData.chickCount);
  }
  if (cycleData.growerId !== undefined) {
    fields.push('grower_id = ?');
    values.push(cycleData.growerId);
  }
  
  if (fields.length === 0) return null;
  
  values.push(id);
  const result = await db.runAsync(
    `UPDATE cycles SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    ...values
  );
  return result;
};

export const deleteCycle = async (id: string) => {
  const result = await db.runAsync(`DELETE FROM cycles WHERE id = ?`, id);
  return result;
};

// Cycle activity operations
export const createCycleActivity = async (activityData: {
  id: string;
  cycleId: string;
  activityType: string;
  activityDate: string;
  details?: string;
}) => {
  const result = await db.runAsync(
    `INSERT INTO cycle_activities (id, cycle_id, activity_type, activity_date, details)
     VALUES (?, ?, ?, ?, ?)`,
    activityData.id, activityData.cycleId, activityData.activityType, activityData.activityDate, activityData.details
  );
  return result;
};

export const getActivitiesByCycleId = async (cycleId: string) => {
  const result = await db.getAllAsync(
    `SELECT * FROM cycle_activities WHERE cycle_id = ? ORDER BY activity_date DESC`, 
    cycleId
  );
  return result;
};

export const getActivityById = async (id: string) => {
  const result = await db.getFirstAsync(`SELECT * FROM cycle_activities WHERE id = ?`, id);
  return result;
};

export const updateActivity = async (id: string, activityData: {
  activityType?: string;
  activityDate?: string;
  details?: string;
}) => {
  const fields = [];
  const values = [];
  
  if (activityData.activityType !== undefined) {
    fields.push('activity_type = ?');
    values.push(activityData.activityType);
  }
  if (activityData.activityDate !== undefined) {
    fields.push('activity_date = ?');
    values.push(activityData.activityDate);
  }
  if (activityData.details !== undefined) {
    fields.push('details = ?');
    values.push(activityData.details);
  }
  
  if (fields.length === 0) return null;
  
  values.push(id);
  const result = await db.runAsync(
    `UPDATE cycle_activities SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    ...values
  );
  return result;
};

export const deleteActivity = async (id: string) => {
  const result = await db.runAsync(`DELETE FROM cycle_activities WHERE id = ?`, id);
  return result;
};

// Initialize database when module is loaded
initDatabase();

export default db;
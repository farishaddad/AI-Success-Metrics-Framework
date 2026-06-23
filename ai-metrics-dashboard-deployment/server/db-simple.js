// Simple JSON file-based database (no compilation needed)
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file
const file = join(__dirname, 'database', 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, {});

// Initialize database
await db.read();
db.data ||= { feedback: [], useCases: [], users: [] };
await db.write();

// Feedback operations
export const feedbackDB = {
  async getAll() {
    await db.read();
    return db.data.feedback || [];
  },

  async create(feedback) {
    await db.read();
    const id = Date.now();
    const newFeedback = { id, ...feedback };
    db.data.feedback.push(newFeedback);
    await db.write();
    return newFeedback;
  },

  async getById(id) {
    await db.read();
    return db.data.feedback.find(f => f.id === parseInt(id));
  },

  async delete(id) {
    await db.read();
    db.data.feedback = db.data.feedback.filter(f => f.id !== parseInt(id));
    await db.write();
  }
};

// Use Case operations
export const useCaseDB = {
  async getAll() {
    await db.read();
    return db.data.useCases || [];
  },

  async create(useCase) {
    await db.read();
    db.data.useCases.push(useCase);
    await db.write();
    return useCase;
  },

  async getById(id) {
    await db.read();
    return db.data.useCases.find(uc => uc.id === id);
  },

  async update(id, useCase) {
    await db.read();
    const index = db.data.useCases.findIndex(uc => uc.id === id);
    if (index !== -1) {
      db.data.useCases[index] = { ...db.data.useCases[index], ...useCase };
      await db.write();
      return db.data.useCases[index];
    }
    return null;
  },

  async delete(id) {
    await db.read();
    db.data.useCases = db.data.useCases.filter(uc => uc.id !== id);
    await db.write();
  }
};

// User operations
export const userDB = {
  async getAll() {
    await db.read();
    return db.data.users || [];
  },

  async create(user) {
    await db.read();
    const id = Date.now();
    const newUser = {
      id,
      ...user,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    db.data.users.push(newUser);
    await db.write();
    return newUser;
  },

  async getById(id) {
    await db.read();
    return db.data.users.find(u => u.id === parseInt(id));
  },

  async getByUsername(username) {
    await db.read();
    return db.data.users.find(u => u.username === username);
  },

  async getByEmail(email) {
    await db.read();
    return db.data.users.find(u => u.email === email);
  },

  async update(id, userData) {
    await db.read();
    const index = db.data.users.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      db.data.users[index] = { 
        ...db.data.users[index], 
        ...userData,
        updatedAt: new Date().toISOString()
      };
      await db.write();
      return db.data.users[index];
    }
    return null;
  },

  async updateLastLogin(id) {
    await db.read();
    const index = db.data.users.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      db.data.users[index].lastLogin = new Date().toISOString();
      await db.write();
      return db.data.users[index];
    }
    return null;
  },

  async delete(id) {
    await db.read();
    db.data.users = db.data.users.filter(u => u.id !== parseInt(id));
    await db.write();
  },

  async toggleActive(id) {
    await db.read();
    const index = db.data.users.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      db.data.users[index].isActive = !db.data.users[index].isActive;
      await db.write();
      return db.data.users[index];
    }
    return null;
  }
};

export default db;

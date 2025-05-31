// config/database.js - Database Configuration
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data_pusher.db');

let db;
let isInitialized = false;

const initializeDatabase = () => {
  if (isInitialized) {
    return db;
  }

  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      process.exit(1);
    }
    console.log('Connected to SQLite database');
  });

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Create tables
  db.serialize(() => {
    // Accounts table
    db.run(`CREATE TABLE IF NOT EXISTS accounts (
      account_id INTEGER PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      account_name TEXT NOT NULL,
      website TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Destinations table
    db.run(`CREATE TABLE IF NOT EXISTS destinations (
      destination_id INTEGER PRIMARY KEY,
      account_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      http_method TEXT NOT NULL,
      headers TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (account_id) REFERENCES accounts (account_id) ON DELETE CASCADE
    )`);
  });

  isInitialized = true;
  return db;
};

const getDatabase = () => {
  if (!isInitialized) {
    // Auto-initialize if not already done
    return initializeDatabase();
  }
  return db;
};

const closeDatabase = () => {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
        isInitialized = false;
      }
    });
  }
};

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase
};
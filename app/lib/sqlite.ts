import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

function getDBPath(): string {
  const dataDir = path.join(process.cwd(), 'data');
  
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  return path.join(dataDir, 'mazim.db');
}

export function getDatabase(): Database.Database {
  if (db) return db;
  
  try {
    const dbPath = getDBPath();
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initializeDatabase();
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export function initializeDatabase() {
  try {
    const database = getDatabase();
    
    database.exec(`
      CREATE TABLE IF NOT EXISTS admin_content (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        heroTitle TEXT NOT NULL DEFAULT 'I Will Connect You to the World',
        heroDescription TEXT NOT NULL DEFAULT 'Expert assistance for international tickets, local flights, hotel reservations, and seamless visa processing.',
        profileName TEXT NOT NULL DEFAULT 'Your Dedicated Travel Partner',
        profileBio TEXT NOT NULL DEFAULT '"Call us for a swift response. I am committed to making your global travel dreams a reality."',
        profileImage TEXT NOT NULL DEFAULT '👤',
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Ensure default row exists
    const stmt = database.prepare('SELECT COUNT(*) as count FROM admin_content');
    const result = stmt.get() as { count: number };
    
    if (result.count === 0) {
      const insert = database.prepare(`
        INSERT INTO admin_content (id, heroTitle, heroDescription, profileName, profileBio, profileImage)
        VALUES (1, ?, ?, ?, ?, ?)
      `);
      insert.run(
        'I Will Connect You to the World',
        'Expert assistance for international tickets, local flights, hotel reservations, and seamless visa processing.',
        'Your Dedicated Travel Partner',
        '"Call us for a swift response. I am committed to making your global travel dreams a reality."',
        '👤'
      );
    }
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    throw error;
  }
}

export function getAdminContent() {
  try {
    const database = getDatabase();
    const stmt = database.prepare('SELECT * FROM admin_content WHERE id = 1');
    const result = stmt.get();
    return result || {
      id: 1,
      heroTitle: 'I Will Connect You to the World',
      heroDescription: 'Expert assistance for international tickets, local flights, hotel reservations, and seamless visa processing.',
      profileName: 'Your Dedicated Travel Partner',
      profileBio: '"Call us for a swift response. I am committed to making your global travel dreams a reality."',
      profileImage: '👤',
    };
  } catch (error) {
    console.error('Failed to get admin content:', error);
    throw error;
  }
}

export function updateAdminContent(data: {
  heroTitle: string;
  heroDescription: string;
  profileName: string;
  profileBio: string;
  profileImage: string;
}) {
  try {
    const database = getDatabase();
    const now = new Date().toISOString();
    
    const stmt = database.prepare(`
      UPDATE admin_content 
      SET heroTitle = ?, heroDescription = ?, profileName = ?, profileBio = ?, profileImage = ?, updatedAt = ?
      WHERE id = 1
    `);
    
    stmt.run(
      data.heroTitle,
      data.heroDescription,
      data.profileName,
      data.profileBio,
      data.profileImage,
      now
    );
    
    const select = database.prepare('SELECT * FROM admin_content WHERE id = 1');
    return select.get();
  } catch (error) {
    console.error('Failed to update admin content:', error);
    throw error;
  }
}

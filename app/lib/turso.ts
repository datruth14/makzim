import { createClient, Client } from '@libsql/client';
import { getAdminContentFromStorage, saveAdminContentToStorage } from './storage';

export interface AdminContent {
  id: number;
  headerTitle: string;
  headerPhone: string;
  heroTitle: string;
  heroDescription: string;
  profileName: string;
  profileBio: string;
  profileImage: string;
  footerTitle: string;
  footerDescription: string;
  footerCopyright: string;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_CONTENT: Omit<AdminContent, 'id' | 'createdAt' | 'updatedAt'> = {
  headerTitle: 'Maksim Travels',
  headerPhone: '07069085676',
  heroTitle: 'I Will Connect You to the World',
  heroDescription: 'Expert assistance for international tickets, local flights, hotel reservations, and seamless visa processing.',
  profileName: 'Your Dedicated Travel Partner',
  profileBio: '"Call us for a swift response. I am committed to making your global travel dreams a reality."',
  profileImage: '👤',
  footerTitle: 'Maksim Travels',
  footerDescription: 'I Will Connect You to the World',
  footerCopyright: `© ${new Date().getFullYear()} Maksim Travels. All rights reserved.`,
};

let db: Client | null = null;

function getTursoClient(): Client {
  if (db) return db;

  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('TURSO_DATABASE_URL environment variable is not set');
  }

  if (!token) {
    throw new Error('TURSO_AUTH_TOKEN environment variable is not set');
  }

  try {
    db = createClient({
      url,
      authToken: token,
    });
    console.log('Turso client initialized');
    return db;
  } catch (error) {
    console.error('Failed to initialize Turso client:', error);
    throw error;
  }
}

export async function initializeTursoDatabase() {
  try {
    const client = getTursoClient();

    // Create table if it doesn't exist
    await client.execute(`
      CREATE TABLE IF NOT EXISTS admin_content (
        id INTEGER PRIMARY KEY,
        headerTitle TEXT NOT NULL,
        headerPhone TEXT NOT NULL,
        heroTitle TEXT NOT NULL,
        heroDescription TEXT NOT NULL,
        profileName TEXT NOT NULL,
        profileBio TEXT NOT NULL,
        profileImage TEXT NOT NULL,
        footerTitle TEXT NOT NULL,
        footerDescription TEXT NOT NULL,
        footerCopyright TEXT NOT NULL,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if default row exists
    const result = await client.execute('SELECT COUNT(*) as count FROM admin_content');
    const count = (result.rows[0] as any)?.count || 0;

    if (count === 0) {
      await client.execute(
        `INSERT INTO admin_content (id, headerTitle, headerPhone, heroTitle, heroDescription, profileName, profileBio, profileImage, footerTitle, footerDescription, footerCopyright)
         VALUES (1, '${DEFAULT_CONTENT.headerTitle}', '${DEFAULT_CONTENT.headerPhone}', '${DEFAULT_CONTENT.heroTitle}', '${DEFAULT_CONTENT.heroDescription}', '${DEFAULT_CONTENT.profileName}', '${DEFAULT_CONTENT.profileBio}', '${DEFAULT_CONTENT.profileImage}', '${DEFAULT_CONTENT.footerTitle}', '${DEFAULT_CONTENT.footerDescription}', '${DEFAULT_CONTENT.footerCopyright}')`
      );
      console.log('Default admin content inserted');
    }

    console.log('Turso database initialized successfully');
  } catch (error) {
    console.log('Turso initialization note:', error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getAdminContent(): Promise<AdminContent> {
  try {
    const client = getTursoClient();
    const result = await client.execute('SELECT * FROM admin_content WHERE id = 1');

    if (result.rows.length > 0) {
      const row = result.rows[0] as any;
      console.log('Fetched admin content from Turso');
      return {
        id: row.id || 1,
        headerTitle: row.headerTitle,
        headerPhone: row.headerPhone,
        heroTitle: row.heroTitle,
        heroDescription: row.heroDescription,
        profileName: row.profileName,
        profileBio: row.profileBio,
        profileImage: row.profileImage,
        footerTitle: row.footerTitle,
        footerDescription: row.footerDescription,
        footerCopyright: row.footerCopyright,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };
    }
  } catch (error) {
    console.log('Turso fetch note:', error instanceof Error ? error.message : 'Unknown error');
  }

  // Fall back to file-based storage
  console.log('Using file-based storage for admin content (Turso unavailable)');
  return getAdminContentFromStorage();
}

export async function updateAdminContent(
  data: Omit<AdminContent, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AdminContent> {
  const updatedContent: AdminContent = {
    id: 1,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Try to update in Turso first (for production on Vercel)
  try {
    const client = getTursoClient();
    await client.execute(
      `UPDATE admin_content 
       SET headerTitle = '${data.headerTitle}', headerPhone = '${data.headerPhone}', heroTitle = '${data.heroTitle}', heroDescription = '${data.heroDescription}', profileName = '${data.profileName}', profileBio = '${data.profileBio}', profileImage = '${data.profileImage}', footerTitle = '${data.footerTitle}', footerDescription = '${data.footerDescription}', footerCopyright = '${data.footerCopyright}', updatedAt = CURRENT_TIMESTAMP
       WHERE id = 1`
    );
    console.log('Admin content updated in Turso');
  } catch (tursoError) {
    console.log('Turso update note:', tursoError instanceof Error ? tursoError.message : 'Unknown error');
  }

  // Also save to file storage for local fallback
  const savedContent = saveAdminContentToStorage(updatedContent);
  return savedContent;
}

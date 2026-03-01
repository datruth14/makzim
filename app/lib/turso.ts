import { createClient } from '@libsql/client';

export interface AdminContent {
  id: number;
  heroTitle: string;
  heroDescription: string;
  profileName: string;
  profileBio: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_CONTENT: Omit<AdminContent, 'id' | 'createdAt' | 'updatedAt'> = {
  heroTitle: 'I Will Connect You to the World',
  heroDescription: 'Expert assistance for international tickets, local flights, hotel reservations, and seamless visa processing.',
  profileName: 'Your Dedicated Travel Partner',
  profileBio: '"Call us for a swift response. I am committed to making your global travel dreams a reality."',
  profileImage: '👤',
};

let client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (client) return client;

  const url = process.env.TURSO_CONNECTION_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('TURSO_CONNECTION_URL environment variable is not set');
  }

  if (!token) {
    throw new Error('TURSO_AUTH_TOKEN environment variable is not set');
  }

  client = createClient({
    url,
    authToken: token,
  });

  return client;
}

export async function initializeTursoDatabase() {
  try {
    const db = getClient();

    // Create table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admin_content (
        id INTEGER PRIMARY KEY,
        heroTitle TEXT NOT NULL,
        heroDescription TEXT NOT NULL,
        profileName TEXT NOT NULL,
        profileBio TEXT NOT NULL,
        profileImage TEXT NOT NULL,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure default row exists
    const existing = await db.execute('SELECT COUNT(*) as count FROM admin_content');
    
    if (existing.rows.length === 0 || (existing.rows[0] as any).count === 0) {
      await db.execute(
        `INSERT INTO admin_content (id, heroTitle, heroDescription, profileName, profileBio, profileImage)
         VALUES (1, ?, ?, ?, ?, ?)`,
        [
          DEFAULT_CONTENT.heroTitle,
          DEFAULT_CONTENT.heroDescription,
          DEFAULT_CONTENT.profileName,
          DEFAULT_CONTENT.profileBio,
          DEFAULT_CONTENT.profileImage,
        ]
      );
    }

    console.log('Turso database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Turso database:', error);
    throw error;
  }
}

export async function getAdminContent(): Promise<AdminContent> {
  try {
    const db = getClient();
    const result = await db.execute('SELECT * FROM admin_content WHERE id = 1');

    if (result.rows.length === 0) {
      // Return default content with mock IDs if table is empty
      return {
        id: 1,
        ...DEFAULT_CONTENT,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return result.rows[0] as AdminContent;
  } catch (error) {
    console.error('Failed to get admin content from Turso:', error);
    // Return default content on error
    return {
      id: 1,
      ...DEFAULT_CONTENT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function updateAdminContent(
  data: Omit<AdminContent, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AdminContent> {
  try {
    const db = getClient();

    await db.execute(
      `UPDATE admin_content 
       SET heroTitle = ?, heroDescription = ?, profileName = ?, profileBio = ?, profileImage = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = 1`,
      [
        data.heroTitle,
        data.heroDescription,
        data.profileName,
        data.profileBio,
        data.profileImage,
      ]
    );

    // Fetch and return updated content
    const result = await db.execute('SELECT * FROM admin_content WHERE id = 1');
    return result.rows[0] as AdminContent;
  } catch (error) {
    console.error('Failed to update admin content in Turso:', error);
    throw error;
  }
}

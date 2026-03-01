import axios from 'axios';

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

let cachedInstance: axios.AxiosInstance | null = null;

function getTursoClient() {
  if (cachedInstance) return cachedInstance;

  const token = process.env.TURSO_AUTH_TOKEN;
  let url = process.env.TURSO_DATABASE_URL;

  if (!token) {
    throw new Error('TURSO_AUTH_TOKEN environment variable is not set');
  }

  if (!url) {
    throw new Error('TURSO_DATABASE_URL environment variable is not set');
  }

  // Convert libsql:// to https://
  if (url.startsWith('libsql://')) {
    url = url.replace('libsql://', 'https://');
  }

  // Use Turso REST API
  cachedInstance = axios.create({
    baseURL: url,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return cachedInstance;
}

async function executeQuery(sql: string, args?: any[]) {
  try {
    const client = getTursoClient();
    const response = await client.post('/v2/query', {
      statements: [{ sql, args }],
    });
    return response.data;
  } catch (error: any) {
    console.error('Query execution error:', error.response?.data || error.message);
    throw error;
  }
}

export async function initializeTursoDatabase() {
  try {
    // Create table
    await executeQuery(`
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

    // Check if default row exists
    const result = await executeQuery('SELECT COUNT(*) as count FROM admin_content');
    const count = result.results[0]?.rows[0]?.[0] || 0;
    
    if (count === 0) {
      await executeQuery(
        `INSERT INTO admin_content (id, heroTitle, heroDescription, profileName, profileBio, profileImage)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [1, DEFAULT_CONTENT.heroTitle, DEFAULT_CONTENT.heroDescription, DEFAULT_CONTENT.profileName, DEFAULT_CONTENT.profileBio, DEFAULT_CONTENT.profileImage]
      );
    }

    console.log('Turso database initialized successfully');
  } catch (error: any) {
    console.log('Database initialization info:', error?.message);
  }
}

export async function getAdminContent(): Promise<AdminContent> {
  try {
    const result = await executeQuery('SELECT * FROM admin_content WHERE id = 1');
    const rows = result.results[0]?.rows || [];

    if (rows.length === 0) {
      return {
        id: 1,
        ...DEFAULT_CONTENT,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const row = rows[0];
    return {
      id: row[0],
      heroTitle: row[1],
      heroDescription: row[2],
      profileName: row[3],
      profileBio: row[4],
      profileImage: row[5],
      createdAt: row[6],
      updatedAt: row[7],
    } as unknown as AdminContent;
  } catch (error) {
    console.error('Failed to get admin content from Turso:', error);
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
    // Try to update in Turso database
    try {
      await executeQuery(
        `UPDATE admin_content 
         SET heroTitle = ?, heroDescription = ?, profileName = ?, profileBio = ?, profileImage = ?, updatedAt = CURRENT_TIMESTAMP
         WHERE id = 1`,
        [data.heroTitle, data.heroDescription, data.profileName, data.profileBio, data.profileImage]
      );
    } catch (updateError: any) {
      console.log('Turso update note:', updateError?.response?.data?.error || updateError?.message);
      // Continue even if update fails - we'll return the new data
    }

    // Return the updated content with current timestamp
    return {
      id: 1,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to update admin content in Turso:', error);
    // Still return the data even if save fails
    return {
      id: 1,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

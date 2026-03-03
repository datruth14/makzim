import fs from 'fs';
import path from 'path';

export interface AdminContent {
  id: number;
  headerTitle: string;
  headerPhone: string;
  whatsappNumber: string;
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
  whatsappNumber: '2347069085676',
  heroTitle: 'I Will Connect You to the World',
  heroDescription: 'Expert assistance for international tickets, local flights, hotel reservations, and seamless visa processing.',
  profileName: 'Your Dedicated Travel Partner',
  profileBio: '"Call us for a swift response. I am committed to making your global travel dreams a reality."',
  profileImage: '👤',
  footerTitle: 'Maksim Travels',
  footerDescription: 'I Will Connect You to the World',
  footerCopyright: `© ${new Date().getFullYear()} Maksim Travels. All rights reserved.`,
};

function getStoragePath(): string {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'admin-content.json');
}

function getDefaultContent(): AdminContent {
  return {
    id: 1,
    ...DEFAULT_CONTENT,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Local file storage (works on localhost)
function getAdminContentFromFile(): AdminContent {
  try {
    const storagePath = getStoragePath();
    if (fs.existsSync(storagePath)) {
      const data = fs.readFileSync(storagePath, 'utf-8');
      const parsed = JSON.parse(data);
      return parsed as AdminContent;
    }
  } catch (error) {
    console.error('Failed to read admin content from file:', error);
  }
  return getDefaultContent();
}

function saveAdminContentToFile(content: AdminContent): void {
  try {
    const storagePath = getStoragePath();
    fs.writeFileSync(storagePath, JSON.stringify(content, null, 2), 'utf-8');
    console.log('✓ Admin content saved to file');
  } catch (error) {
    console.error('Failed to save admin content to file:', error);
  }
}

// Redis/Vercel KV storage (works on Vercel)
async function getAdminContentFromKV(): Promise<AdminContent | null> {
  try {
    const { kv } = await import('@vercel/kv');
    const data = await kv.get('admin-content');
    if (data) {
      console.log('✓ Fetched admin content from Vercel KV');
      return data as AdminContent;
    }
  } catch (error) {
    console.log('⚠️  Vercel KV not available:', error instanceof Error ? error.message : 'Unknown error');
  }
  return null;
}

async function saveAdminContentToKV(content: AdminContent): Promise<boolean> {
  try {
    const { kv } = await import('@vercel/kv');
    await kv.set('admin-content', content);
    console.log('✓ Admin content saved to Vercel KV');
    return true;
  } catch (error) {
    console.log('⚠️  Could not save to Vercel KV:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

// Main functions with fallback logic
export async function getAdminContent(): Promise<AdminContent> {
  // Try KV first (for Vercel)
  const kvContent = await getAdminContentFromKV();
  if (kvContent) {
    return kvContent;
  }

  // Fall back to local file (for localhost)
  console.log('⚠️  Falling back to local file storage');
  return getAdminContentFromFile();
}

export async function saveAdminContent(content: AdminContent): Promise<AdminContent> {
  const data: AdminContent = {
    ...content,
    updatedAt: new Date().toISOString(),
  };

  // Always save to file (works on localhost, persists during session on Vercel)
  saveAdminContentToFile(data);

  // Try to save to Vercel KV (persists on Vercel)
  const kvSuccess = await saveAdminContentToKV(data);

  if (kvSuccess) {
    console.log('✓ Content synced to both file and Vercel KV');
  } else {
    console.log('⚠️  Content saved to file only (KV unavailable)');
  }

  return data;
}

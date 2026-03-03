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

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
}

export function getAdminContent(): AdminContent {
  try {
    const storagePath = getStoragePath();
    if (fs.existsSync(storagePath)) {
      const data = fs.readFileSync(storagePath, 'utf-8');
      const parsed = JSON.parse(data);
      console.log('✓ Loaded admin content from file');
      return parsed as AdminContent;
    }
  } catch (error) {
    console.error('Failed to read admin content:', error);
  }
  return getDefaultContent();
}

export function saveAdminContent(content: AdminContent): AdminContent {
  const data: AdminContent = {
    ...content,
    updatedAt: new Date().toISOString(),
  };

  // Only allow updates on localhost/development
  if (isProduction()) {
    console.log('⚠️  Updates are disabled on production. Commit changes to repository instead.');
    return data;
  }

  try {
    const storagePath = getStoragePath();
    fs.writeFileSync(storagePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('✓ Admin content saved to file');
  } catch (error) {
    console.error('Failed to save admin content:', error);
  }

  return data;
}

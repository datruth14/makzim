import fs from 'fs';
import path from 'path';

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

export function getAdminContentFromStorage(): AdminContent {
  try {
    const storagePath = getStoragePath();
    if (fs.existsSync(storagePath)) {
      const data = fs.readFileSync(storagePath, 'utf-8');
      const parsed = JSON.parse(data);
      return parsed as AdminContent;
    }
  } catch (error) {
    console.error('Failed to read admin content from storage:', error);
  }
  return getDefaultContent();
}

export function saveAdminContentToStorage(content: AdminContent): AdminContent {
  try {
    const storagePath = getStoragePath();
    const data: AdminContent = {
      ...content,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(storagePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Admin content saved to storage');
    return data;
  } catch (error) {
    console.error('Failed to save admin content to storage:', error);
    return content;
  }
}

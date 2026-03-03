import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

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

export function getAdminContent(): AdminContent {
  try {
    const storagePath = getStoragePath();
    if (fs.existsSync(storagePath)) {
      const data = fs.readFileSync(storagePath, 'utf-8');
      const parsed = JSON.parse(data);
      return parsed as AdminContent;
    }
  } catch (error) {
    console.error('Failed to read admin content:', error);
  }
  return getDefaultContent();
}

export function saveAdminContent(content: AdminContent): AdminContent {
  try {
    const storagePath = getStoragePath();
    const data: AdminContent = {
      ...content,
      updatedAt: new Date().toISOString(),
    };
    
    // Write to file
    fs.writeFileSync(storagePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('✓ Admin content saved to file');

    // Try to commit and push to GitHub (works on localhost & Vercel with git)
    try {
      execSync('git add -f data/admin-content.json', { cwd: process.cwd() });
      execSync(`git commit -m "Update admin content: ${new Date().toISOString()}"`, { cwd: process.cwd() });
      execSync('git push', { cwd: process.cwd() });
      console.log('✓ Changes pushed to GitHub');
    } catch (gitError) {
      // Git operations might fail in some environments, but that's okay
      // The file is still saved locally and will work
      console.log('⚠️  Could not push to GitHub (local data still saved):', 
        gitError instanceof Error ? gitError.message : 'Unknown error'
      );
    }

    return data;
  } catch (error) {
    console.error('Failed to save admin content:', error);
    return content;
  }
}

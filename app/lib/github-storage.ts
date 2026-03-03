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

async function updateFileViaGitHubAPI(content: AdminContent): Promise<boolean> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO; // format: owner/repo

    if (!token || !repo) {
      console.log('⚠️  GitHub credentials not configured. Skipping GitHub update.');
      return false;
    }

    const fileContent = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');
    const [owner, repoName] = repo.split('/');

    // Get current file SHA (needed for update)
    const getResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/contents/data/admin-content.json`,
      {
        headers: {
          Authorization: `token ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    let sha = '';
    if (getResponse.ok) {
      const fileData = (await getResponse.json()) as any;
      sha = fileData.sha;
    }

    // Update file via GitHub API
    const updateResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/contents/data/admin-content.json`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          message: `Update admin content: ${new Date().toISOString()}`,
          content: fileContent,
          ...(sha && { sha }),
        }),
      }
    );

    if (updateResponse.ok) {
      console.log('✓ Changes pushed to GitHub via API');
      return true;
    } else {
      const error = await updateResponse.json();
      console.log('✗ GitHub API update failed:', error);
      return false;
    }
  } catch (error) {
    console.log('⚠️  Could not push to GitHub via API:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

export async function saveAdminContent(content: AdminContent): Promise<AdminContent> {
  try {
    const storagePath = getStoragePath();
    const data: AdminContent = {
      ...content,
      updatedAt: new Date().toISOString(),
    };

    // Always save to local file first
    fs.writeFileSync(storagePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('✓ Admin content saved to file');

    // Try to push to GitHub API (works on Vercel)
    await updateFileViaGitHubAPI(data);

    return data;
  } catch (error) {
    console.error('Failed to save admin content:', error);
    return content;
  }
}

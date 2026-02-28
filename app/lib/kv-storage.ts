import { kv } from '@vercel/kv';

export interface AdminContent {
  heroTitle: string;
  heroDescription: string;
  profileName: string;
  profileBio: string;
  profileImage: string;
}

const DEFAULT_CONTENT: AdminContent = {
  heroTitle: 'I Will Connect You to the World',
  heroDescription: 'Expert assistance for international tickets, local flights, hotel reservations, and seamless visa processing.',
  profileName: 'Your Dedicated Travel Partner',
  profileBio: '"Call us for a swift response. I am committed to making your global travel dreams a reality."',
  profileImage: '👤',
};

const CONTENT_KEY = 'mazim:admin:content';

export async function getAdminContent(): Promise<AdminContent> {
  try {
    const content = await kv.get<AdminContent>(CONTENT_KEY);
    return content || DEFAULT_CONTENT;
  } catch (error) {
    console.error('Failed to get admin content from KV:', error);
    return DEFAULT_CONTENT;
  }
}

export async function updateAdminContent(data: AdminContent): Promise<AdminContent> {
  try {
    await kv.set(CONTENT_KEY, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Failed to update admin content in KV:', error);
    throw error;
  }
}

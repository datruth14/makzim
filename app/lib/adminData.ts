export interface AdminContent {
  heroTitle: string;
  heroDescription: string;
  profileName: string;
  profileBio: string;
  profileImage: string;
}

const DEFAULT_CONTENT: AdminContent = {
  heroTitle: "I Will Connect You to the World",
  heroDescription: "Expert assistance for international tickets, local flights, hotel reservations, and seamless visa processing.",
  profileName: "Your Dedicated Travel Partner",
  profileBio: '"Call us for a swift response. I am committed to making your global travel dreams a reality."',
  profileImage: "👤",
};

export function getAdminContent(): AdminContent {
  if (typeof window === 'undefined') return DEFAULT_CONTENT;
  
  const stored = localStorage.getItem('mazimAdminContent');
  return stored ? JSON.parse(stored) : DEFAULT_CONTENT;
}

export function saveAdminContent(content: AdminContent): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mazimAdminContent', JSON.stringify(content));
  }
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('mazimAdminLoggedIn') === 'true';
}

export function setAdminLoggedIn(logged: boolean): void {
  if (typeof window !== 'undefined') {
    if (logged) {
      localStorage.setItem('mazimAdminLoggedIn', 'true');
    } else {
      localStorage.removeItem('mazimAdminLoggedIn');
    }
  }
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminLoggedIn, setAdminLoggedIn } from '@/app/lib/adminData';

interface AdminContent {
  heroTitle: string;
  heroDescription: string;
  profileName: string;
  profileBio: string;
  profileImage: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [content, setContent] = useState<AdminContent | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push('/admin');
      return;
    }
    fetchContent();
  }, [router]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/admin/content');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to fetch content');
      }
      const data = await response.json();
      setContent({
        heroTitle: data.heroTitle,
        heroDescription: data.heroDescription,
        profileName: data.profileName,
        profileBio: data.profileBio,
        profileImage: data.profileImage,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load content';
      setError(errorMsg);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (!response.ok) throw new Error('Failed to save');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save changes');
      console.error(err);
    }
  };

  const handleLogout = () => {
    setAdminLoggedIn(false);
    router.push('/admin');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setContent({ ...content!, profileImage: base64String });
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-gray-600">No content found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 sticky top-0 z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">Maksim Travels Admin</h1>
          <div className="flex items-center gap-4">
            <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold transition">
              ← Home
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
        {/* Success Message */}
          {saved && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              ✓ Changes saved successfully!
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              ✗ {error}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">Edit Website Content</h2>

            <div className="space-y-8">
              {/* Hero Section */}
              <div className="border-b pb-8">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Hero Section</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Hero Title</label>
                    <input
                      type="text"
                      value={content.heroTitle}
                      onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="Enter hero title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Hero Description</label>
                    <textarea
                      value={content.heroDescription}
                      onChange={(e) => setContent({ ...content, heroDescription: e.target.value })}
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                      rows={3}
                      placeholder="Enter hero description"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Section */}
              <div className="border-b pb-8">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Profile Section</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Profile Name</label>
                    <input
                      type="text"
                      value={content.profileName}
                      onChange={(e) => setContent({ ...content, profileName: e.target.value })}
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="Enter profile name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Profile Bio</label>
                    <textarea
                      value={content.profileBio}
                      onChange={(e) => setContent({ ...content, profileBio: e.target.value })}
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                      rows={3}
                      placeholder="Enter profile bio"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Profile Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                    <p className="text-xs text-gray-500 mt-2">Upload a JPG, PNG, or WebP image (max 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-800">Preview</h3>
                <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-xl p-8 mb-6">
                  <h2 className="text-3xl font-bold mb-4">{content.heroTitle}</h2>
                  <p className="text-blue-100">{content.heroDescription}</p>
                </div>

                <div className="bg-slate-100 rounded-xl p-8 flex flex-col items-center text-center">
                  {content.profileImage && content.profileImage.startsWith('data:') ? (
                    <img
                      src={content.profileImage}
                      alt="Profile"
                      className="w-48 h-48 rounded-full object-cover mb-4 border-4 border-white shadow-lg"
                    />
                  ) : content.profileImage ? (
                    <div className="text-6xl mb-4">{content.profileImage}</div>
                  ) : (
                    <div className="w-48 h-48 rounded-full bg-gray-300 mb-4 border-4 border-white shadow-lg flex items-center justify-center text-4xl">📷</div>
                  )}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{content.profileName}</h3>
                  <p className="text-gray-600">{content.profileBio}</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition duration-300 shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [service, setService] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [visaType, setVisaType] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adminContent, setAdminContent] = useState<any>(null);

  useEffect(() => {
    fetchAdminContent();
  }, []);

  const fetchAdminContent = async () => {
    try {
      const response = await fetch('/api/admin/content');
      if (response.ok) {
        const data = await response.json();
        setAdminContent(data);
      } else {
        console.error('Failed to fetch admin content:', response.status);
      }
    } catch (err) {
      console.error('Failed to fetch admin content:', err);
    }
  };

  const showDateFields = service && service !== 'Visas' && service !== 'Hotels';
  const showVisaField = service === 'Visas';
  const showHotelFields = service === 'Hotels';
  const showLocationField = service === 'International Ticket' || service === 'Local Ticket' || service === 'Holiday Packages';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const phoneNumber = "2347069085676";

    let message = `*New Inquiry for Maksim Travels*%0A`;
    message += `*Service:* ${service}%0A`;
    
    if (userLocation) {
      message += `*Your Location:* ${userLocation}%0A`;
    }
    
    message += `*Destination:* ${destination}%0A`;

    if (service === 'Visas') {
      message += `*Visa Type:* ${visaType}%0A`;
    } else if (service === 'Hotels') {
      message += `*Check-in:* ${checkIn}%0A`;
      message += `*Check-out:* ${checkOut}%0A`;
    } else {
      message += `*Travel Date:* ${travelDate}%0A`;
      message += `*Return Date:* ${returnDate}%0A`;
    }

    message += `%0A(Requesting swift response via phone number in video: 07069085676)%0A`;

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm py-4 sticky top-0 z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">{adminContent?.headerTitle || 'Maksim Travels'}</h1>
          <div className="flex items-center gap-4">
            <a href={`tel:${adminContent?.headerPhone || '07069085676'}`} className="text-sm font-semibold text-blue-700 hover:text-blue-800 transition">
              📞 {adminContent?.headerPhone || '07069085676'}
            </a>
            <a href="/admin" className="text-xs font-semibold text-gray-600 hover:text-blue-700 transition">
              Admin
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {adminContent?.heroTitle || 'I Will Connect You to the World'}
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            {adminContent?.heroDescription || 'Expert assistance for international tickets, local flights, hotel reservations, and seamless visa processing.'}
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-6 -mt-16 mb-24">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="grid md:grid-cols-12 items-center">
            {/* Left Panel - Info */}
            <div className="md:col-span-5 bg-slate-100 p-10 flex flex-col items-center text-center h-full border-r border-slate-200">
              {adminContent?.profileImage && adminContent.profileImage.startsWith('data:') ? (
                <img
                  src={adminContent.profileImage}
                  alt="Profile"
                  className="w-48 h-48 rounded-full object-cover shadow-xl border-4 border-white mb-6"
                  suppressHydrationWarning
                />
              ) : (
                <div className="w-48 h-48 rounded-full object-cover shadow-xl border-4 border-white mb-6 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-5xl">
                  {adminContent?.profileImage || '👤'}
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-800">{adminContent?.profileName || 'Your Dedicated Travel Partner'}</h3>
              <p className="text-gray-600 mt-2 text-sm">
                {adminContent?.profileBio || '"Call us for a swift response. I am committed to making your global travel dreams a reality."'}
              </p>
              <a
                href="tel:07069085676"
                className="mt-6 inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-5 py-2 rounded-full font-semibold hover:bg-blue-200 transition"
              >
                <span>📞</span> Call Direct: 07069085676
              </a>
            </div>

            {/* Right Panel - Form */}
            <div className="md:col-span-7 p-10 md:p-14">
              <h3 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4">Request Your Personal Quote</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    What service do you need?
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    required
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  >
                    <option value="">Select service...</option>
                    <option value="International Ticket">International Ticket</option>
                    <option value="Local Ticket">Local Ticket</option>
                    <option value="Hotels">Hotels</option>
                    <option value="Visas">Visas</option>
                    <option value="Holiday Packages">Holiday Packages</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Where are you travelling to?
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="City or Country"
                    className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Location Field - for flights and packages */}
                {showLocationField && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Where are you travelling from?
                    </label>
                    <input
                      type="text"
                      value={userLocation}
                      onChange={(e) => setUserLocation(e.target.value)}
                      placeholder="Your City or Country"
                      className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                )}

                {/* Date Fields - for flights and packages */}
                {showDateFields && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">Travel Date</label>
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">Return Date</label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                  </div>
                )}

                {/* Visa Field */}
                {showVisaField && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      What type of visa do you want?
                    </label>
                    <input
                      type="text"
                      value={visaType}
                      onChange={(e) => setVisaType(e.target.value)}
                      placeholder="e.g. Tourist, Business, Student"
                      className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                )}

                {/* Hotel Fields */}
                {showHotelFields && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">Check-In Date</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">Check-Out Date</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition duration-300 transform hover:scale-105 flex justify-center items-center gap-2 shadow-lg"
                >
                  Get Swift Response on WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-10 mt-16">
        <div className="container mx-auto px-6 text-center text-sm">
          <p className="font-bold text-white mb-2">{adminContent?.footerTitle || 'Maksim Travels'}</p>
          <p>{adminContent?.footerDescription || 'I Will Connect You to the World'}</p>
          <p className="mt-4 opacity-70">{adminContent?.footerCopyright || `© ${new Date().getFullYear()} Maksim Travels. All rights reserved.`}</p>
        </div>
      </footer>
    </>
  );
}

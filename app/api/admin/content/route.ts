import { NextRequest, NextResponse } from 'next/server';
import { getAdminContent, saveAdminContent } from '@/app/lib/simple-storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = getAdminContent();
    console.log('✓ Fetched admin content from file');
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching admin content:', error);
    // Return 200 with fallback data so home page always works
    const fallbackContent = {
      id: 1,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log('Returning fallback content due to error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(fallbackContent);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Updating admin content...');
    
    const content = saveAdminContent({
      id: 1,
      headerTitle: body.headerTitle,
      headerPhone: body.headerPhone,
      whatsappNumber: body.whatsappNumber,
      heroTitle: body.heroTitle,
      heroDescription: body.heroDescription,
      profileName: body.profileName,
      profileBio: body.profileBio,
      profileImage: body.profileImage,
      footerTitle: body.footerTitle,
      footerDescription: body.footerDescription,
      footerCopyright: body.footerCopyright,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    console.log('✓ Admin content updated');
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating admin content:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

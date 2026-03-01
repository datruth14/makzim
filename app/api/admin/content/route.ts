import { NextRequest, NextResponse } from 'next/server';
import { getAdminContent, updateAdminContent, initializeTursoDatabase } from '@/app/lib/turso';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Initialize database on first request
    await initializeTursoDatabase();
    const content = await getAdminContent();
    console.log('Fetched admin content from Turso:', content);
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching admin content:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initialize database on first request
    await initializeTursoDatabase();
    const body = await request.json();
    console.log('Updating admin content in Turso:', body);
    
    const content = await updateAdminContent({
      headerTitle: body.headerTitle,
      headerPhone: body.headerPhone,
      heroTitle: body.heroTitle,
      heroDescription: body.heroDescription,
      profileName: body.profileName,
      profileBio: body.profileBio,
      profileImage: body.profileImage,
      footerTitle: body.footerTitle,
      footerDescription: body.footerDescription,
      footerCopyright: body.footerCopyright,
    });
    
    console.log('Updated admin content:', content);
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

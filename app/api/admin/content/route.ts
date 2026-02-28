import { NextRequest, NextResponse } from 'next/server';
import { getAdminContent, updateAdminContent } from '@/app/lib/sqlite';

export async function GET() {
  try {
    const content = getAdminContent();
    console.log('Fetched admin content:', content);
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
    const body = await request.json();
    console.log('Updating admin content:', body);
    
    const content = updateAdminContent({
      heroTitle: body.heroTitle,
      heroDescription: body.heroDescription,
      profileName: body.profileName,
      profileBio: body.profileBio,
      profileImage: body.profileImage,
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

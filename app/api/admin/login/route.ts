import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = 'admin@app.com';
const ADMIN_PASSWORD = 'admin';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: true, message: 'Login successful' },
        {
          status: 200,
          headers: {
            'Set-Cookie': `adminToken=authenticated; Path=/; Max-Age=${60 * 60 * 24 * 7}; HttpOnly; SameSite=Strict`,
          },
        }
      );
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

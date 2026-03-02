import { NextResponse } from 'next/server';
import { getTursoClient } from '@/app/lib/turso';

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics: Record<string, any> = {};

  // Check environment variables
  diagnostics.envVars = {
    TURSO_DATABASE_URL_exists: !!process.env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN_exists: !!process.env.TURSO_AUTH_TOKEN,
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL ? 'Present' : 'Missing',
  };

  // Try to initialize Turso client
  try {
    console.log('Testing Turso client initialization...');
    const client = getTursoClient();
    diagnostics.tursoClient = 'Successfully created';

    // Try a test query
    try {
      console.log('Testing Turso database connection...');
      await client.execute('SELECT 1 as test');
      diagnostics.tursoConnection = 'SUCCESS - Database is reachable';
      diagnostics.testQuery = 'Ping successful';
    } catch (queryError) {
      diagnostics.tursoConnection = `FAILED - ${queryError instanceof Error ? queryError.message : 'Unknown error'}`;
    }
  } catch (clientError) {
    diagnostics.tursoClient = `Failed - ${clientError instanceof Error ? clientError.message : 'Unknown error'}`;
    diagnostics.tursoConnection = 'Not tested (client init failed)';
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    status: 'debug',
    diagnostics,
    message: 'Check the "diagnostics" object for Turso connection status',
  });
}

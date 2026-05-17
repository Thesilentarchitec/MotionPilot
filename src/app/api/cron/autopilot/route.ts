import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { processAutopilotForUser } from '@/lib/autopilot-core';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  // Basic security check: verify CRON_SECRET if it exists
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  console.log('CRON: Processing autopilot cycle...');

  const supabase = createAdminClient();
  
  try {
    // 1. Fetch all users with settings (in a real app, you'd filter by schedule)
    const { data: allSettings, error: fetchError } = await supabase
      .from('settings')
      .select('user_id');

    if (fetchError) throw fetchError;

    if (!allSettings || allSettings.length === 0) {
      return NextResponse.json({ message: 'No users found with autopilot settings' });
    }

    // 2. Process each user (for small scale demo, we just do all)
    // In a production app, you'd check if 'now' matches their schedule
    const results = [];
    for (const settings of allSettings) {
      try {
        const result = await processAutopilotForUser(settings.user_id);
        results.push({ userId: settings.user_id, status: 'success', details: result });
      } catch (err: any) {
        results.push({ userId: settings.user_id, status: 'error', error: err.message });
      }
    }

    return NextResponse.json({ 
      processed: allSettings.length,
      results 
    });

  } catch (error: any) {
    console.error('CRON Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

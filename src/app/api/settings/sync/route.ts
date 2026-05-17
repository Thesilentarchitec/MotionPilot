import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncUserSchedule } from '@/lib/scheduler';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { schedule_times } = await request.json();

  try {
    // 1. Update settings in database
    const { error: updateError } = await supabase
      .from('settings')
      .update({ schedule_times })
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    // 2. Sync BullMQ schedule
    await syncUserSchedule(user.id, schedule_times);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings sync failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

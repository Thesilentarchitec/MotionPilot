import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { autopilotQueue, AUTOPILOT_JOB_NAME } from '@/lib/queue';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Add a one-off job to the queue for immediate generation
    await autopilotQueue.add(AUTOPILOT_JOB_NAME, { userId: user.id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Manual generation trigger failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

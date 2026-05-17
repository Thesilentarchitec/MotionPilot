'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<string[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [platformToggles, setPlatformToggles] = useState<Record<string, boolean>>({});

  const supabase = createClient();

  useEffect(() => {
    async function loadSettings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setSchedule(data.schedule_times || []);
        setThemes(data.themes || []);
        setPlatformToggles(data.platform_toggles || {});
      }
      setLoading(false);
    }

    loadSettings();
  }, [supabase]);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const response = await fetch('/api/settings/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schedule_times: schedule,
      }),
    });

    if (response.ok) {
      alert('Settings saved and schedule synced.');
    } else {
      alert('Failed to save settings.');
    }
  };

  const addTime = () => setSchedule([...schedule, '12:00']);
  const removeTime = (index: number) => setSchedule(schedule.filter((_, i) => i !== index));

  if (loading) return <div className="p-12 font-mono">Loading...</div>;

  return (
    <div className="p-12 space-y-12 max-w-2xl">
      <header>
        <h2 className="text-3xl font-serif">Settings</h2>
        <p className="text-[10px] uppercase tracking-widest opacity-50 mt-2 font-mono">Configure your autopilot</p>
      </header>

      <section className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-[10px] uppercase tracking-widest opacity-30">Autopilot Schedule</p>
            <button onClick={addTime} className="text-[10px] uppercase tracking-widest border-0.5 border-foreground/20 px-2 py-1">Add Slot</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {schedule.map((time, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    const newSched = [...schedule];
                    newSched[i] = e.target.value;
                    setSchedule(newSched);
                  }}
                  className="bg-transparent border-0.5 border-foreground/10 px-2 py-1 font-mono text-xs w-full"
                />
                <button onClick={() => removeTime(i)} className="opacity-30 hover:opacity-100">&times;</button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8">
           <button onClick={handleSave} className="btn w-full">Save & Sync Schedule</button>
        </div>
      </section>
    </div>
  );
}

'use client';

export default function Dashboard() {
  const handleGenerateNow = async () => {
    const response = await fetch('/api/autopilot/generate-now', {
      method: 'POST',
    });
    if (response.ok) {
      alert('Generation triggered! The post will appear in your history soon.');
    } else {
      alert('Failed to trigger generation.');
    }
  };

  return (
    <div className="p-12 space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif">Command Center</h2>
          <p className="text-[10px] uppercase tracking-widest opacity-50 mt-2 font-mono">
            System Status: Active & Monitoring
          </p>
        </div>
        <div className="flex gap-4">
          <button className="btn" onClick={handleGenerateNow}>
            Generate & Preview
          </button>
          <button className="btn border-status-green text-status-green">
            Force Deploy
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Metrics */}
        <div className="col-span-12 grid grid-cols-4 gap-4">
          {[
            { label: "Total Reach", value: "24.5k", change: "+12%" },
            { label: "Posts Today", value: "4/6", change: "In Progress" },
            { label: "Weekly Count", value: "42", change: "On Track" },
            { label: "System Health", value: "99.9%", change: "Stable" },
          ].map((stat, i) => (
            <div key={i} className="card">
              <p className="text-[10px] uppercase tracking-widest opacity-30 mb-2">{stat.label}</p>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-serif">{stat.value}</span>
                <span className="text-[10px] text-status-green">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Preview */}
        <div className="col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-[10px] uppercase tracking-widest opacity-30">Next Post Preview</p>
            <div className="flex gap-4">
              <span className="text-[10px] uppercase tracking-widest opacity-50">9:16</span>
              <span className="text-[10px] uppercase tracking-widest opacity-50">1:1</span>
              <span className="text-[10px] uppercase tracking-widest opacity-50">16:9</span>
            </div>
          </div>
          <div className="aspect-[16/9] border-0.5 border-foreground/10 bg-secondary flex items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
             <div className="relative z-10 text-center space-y-4 max-w-lg px-8">
               <p className="font-serif text-2xl italic">"Discipline is the bridge between goals and accomplishment."</p>
               <p className="text-[10px] uppercase tracking-widest opacity-50">— mindset | discipline</p>
             </div>
             <div className="absolute bottom-4 right-4 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
             </div>
          </div>
          <div className="terminal-box">
             <p className="opacity-50 font-bold mb-1">Generated Caption:</p>
             <p>Success isn't about greatness. It's about consistency. Consistent hard work leads to success. Greatness will come. #discipline #growth #mindset</p>
          </div>
        </div>

        {/* Schedule & Toggles */}
        <div className="col-span-4 space-y-8">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest opacity-30">Platform Toggles</p>
            <div className="space-y-2">
              {['TikTok', 'Instagram', 'YouTube', 'Snapchat'].map((platform) => (
                <div key={platform} className="flex justify-between items-center py-2 border-b-0.5 border-foreground/5">
                  <span className="text-xs uppercase tracking-wider">{platform}</span>
                  <div className="w-8 h-4 bg-status-green/20 border-0.5 border-status-green flex items-center px-1">
                    <div className="w-2 h-2 bg-status-green" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest opacity-30">Today's Schedule</p>
            <div className="space-y-3">
              {[
                { time: "06:00", status: "Posted" },
                { time: "10:00", status: "Posted" },
                { time: "13:00", status: "Posted" },
                { time: "16:00", status: "Posted" },
                { time: "19:00", status: "Pending", current: true },
                { time: "22:00", status: "Scheduled" },
              ].map((slot, i) => (
                <div key={i} className={`flex justify-between items-center py-2 px-3 border-0.5 ${slot.current ? 'border-status-green bg-status-green/5' : 'border-foreground/5'}`}>
                  <span className="text-xs font-mono">{slot.time}</span>
                  <span className={`text-[10px] uppercase tracking-widest ${slot.current ? 'text-status-green' : 'opacity-30'}`}>
                    {slot.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

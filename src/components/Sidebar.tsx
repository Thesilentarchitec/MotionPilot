import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="w-64 border-r-0.5 border-foreground/10 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <h1 className="text-xl tracking-widest uppercase font-serif">MotionPilot</h1>
        <p className="text-[10px] opacity-50 mt-2 font-mono uppercase tracking-tighter">Autopilot v1.0.0</p>
      </div>
      
      <nav className="flex-1 px-8 space-y-6 mt-10">
        <div className="space-y-4">
          <p className="text-[10px] opacity-30 uppercase tracking-widest font-mono">Control</p>
          <ul className="space-y-4">
            <li>
              <Link href="/" className="nav-link">Dashboard</Link>
            </li>
            <li>
              <Link href="/posts" className="nav-link">Post History</Link>
            </li>
            <li>
              <Link href="/analytics" className="nav-link">Analytics</Link>
            </li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <p className="text-[10px] opacity-30 uppercase tracking-widest font-mono">System</p>
          <ul className="space-y-4">
            <li>
              <Link href="/settings" className="nav-link">Settings</Link>
            </li>
            <li>
              <Link href="/logs" className="nav-link">Activity Log</Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="p-8 mt-auto">
        <div className="flex items-center gap-3">
          <div className="status-indicator" />
          <span className="text-[10px] uppercase tracking-widest opacity-50">System Live</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

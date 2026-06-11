import { Mail, Calendar, Search, Plus, Bell, User, Inbox, Send, Archive, Bot } from 'lucide-react';

export default function MailOS() {
  return (
    <main className="min-h-screen bg-[#FDF9F8] p-4 text-slate-800 font-sans">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-[240px,350px,1fr,320px] gap-4 h-[calc(100vh-32px)]">
        
        {/* 1. Navigation Sidebar */}
        <nav className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-8">
            <h1 className="font-bold text-xl flex items-center gap-2 text-rose-500"><Mail /> MailOS</h1>
            <div className="space-y-2">
              <NavItem icon={Inbox} label="Inbox" count={12} active />
              <NavItem icon={Send} label="Sent" />
              <NavItem icon={Archive} label="Archive" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl flex items-center gap-3 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            <div className="text-xs font-semibold">Arjun Mehta</div>
          </div>
        </nav>

        {/* 2. Email List */}
        <section className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-4 overflow-y-auto">
          <input className="w-full bg-white/50 border border-slate-200 rounded-xl p-3 text-sm mb-4" placeholder="Search emails..." />
          {/* Map your email items here */}
          <EmailItem sender="Alex Johnson" preview="Project sync tomorrow?" time="10:42 AM" />
        </section>

        {/* 3. Reading Pane */}
        <section className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-inner">
          <h2 className="text-2xl font-semibold mb-6">Project sync tomorrow?</h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p>Hi Arjun, Can we move our project sync tomorrow to 4 PM?</p>
            <div className="flex gap-2 mt-6">
              <button className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm">Reply</button>
            </div>
          </div>
        </section>

        {/* 4. AI Assistant & Calendar Pane */}
        <aside className="space-y-4">
          <div className="bg-indigo-50/50 backdrop-blur-md border border-indigo-100 rounded-3xl p-6">
            <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-4"><Bot size={18}/> AI Assistant</h3>
            <p className="text-sm text-indigo-700/80">Alex is asking to move the meeting...</p>
          </div>
          <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-6 h-64">
            <h3 className="font-semibold mb-4">Calendar</h3>
            {/* Add calendar component here */}
          </div>
        </aside>

      </div>
    </main>
  );
}

// Helper Components
function NavItem({ icon: Icon, label, count, active }: any) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl cursor-pointer ${active ? 'bg-rose-50 text-rose-600' : 'hover:bg-slate-100'}`}>
      <div className="flex items-center gap-3 font-medium text-sm">
        <Icon size={18} /> {label}
      </div>
      {count && <span className="text-[10px] bg-rose-200 px-2 py-0.5 rounded-full">{count}</span>}
    </div>
  );
}

function EmailItem({ sender, preview, time }: any) {
  return (
    <div className="p-4 hover:bg-white rounded-2xl cursor-pointer border-b border-slate-100">
      <div className="flex justify-between text-xs font-bold mb-1">
        <span>{sender}</span>
        <span className="text-slate-400">{time}</span>
      </div>
      <p className="text-sm text-slate-600 truncate">{preview}</p>
    </div>
  );
}
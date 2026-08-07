import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Briefcase, Cpu, BotMessageSquare, Menu, X } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // State untuk buka/tutup menu di HP

  const menuItems = [
    { path: "/", icon: <Home size={24} />, label: "Command Center" },
    { path: "/projects", icon: <Cpu size={24} />, label: "Architectures" },
    { path: "/experience", icon: <Briefcase size={24} />, label: "Core Logs" },
    { path: "/ai-chat", icon: <BotMessageSquare size={24} />, label: "AI Twin" },
  ];

  // Fungsi untuk menutup menu setelah link di-klik (di HP)
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* 📱 MOBILE TOP NAVIGATION BAR (Muncul hanya di HP) */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 glass-panel z-50 flex items-center justify-between px-6 border-b border-slate-700/50 backdrop-blur-lg bg-[#0f172a]/80">
        <div className="w-8 h-8 rounded-full bg-cyan-900/40 border border-cyan-400 flex items-center justify-center shadow-[0_0_8px_rgba(34,211,238,0.5)]">
          <span className="text-cyan-400 font-bold font-mono text-sm">WS</span>
        </div>
        
        {/* Tombol Hamburger */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-cyan-400 hover:text-white transition-colors focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* 📱 MOBILE MENU DROPDOWN (Layar Penuh saat Hamburger diklik) */}
      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-[#0f172a]/95 backdrop-blur-xl z-40 flex flex-col items-center pt-10 border-b border-slate-700/50">
          <nav className="flex flex-col gap-8 w-full items-center">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  onClick={closeMenu}
                  className={`flex items-center gap-4 text-xl font-mono transition-colors w-full text-start px-7 py-3 ${isActive ? "text-cyan-400 bg-cyan-900/20 border-l-4 border-cyan-400" : "text-slate-400 hover:text-cyan-300"}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* 💻 DESKTOP SIDEBAR (Muncul hanya di Komputer/Tablet) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-20 glass-panel border-r border-slate-700/50 flex-col items-center py-8 z-50">
        <div className="mb-12 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-cyan-900/40 border border-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.5)] group-hover:scale-110 transition-transform">
            <span className="text-cyan-400 font-bold font-mono text-lg">WS</span>
          </div>
        </div>

        <nav className="flex flex-col gap-8 flex-1 w-full items-center">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`relative group transition-colors w-full flex justify-center ${isActive ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "text-slate-400 hover:text-cyan-300"}`}
              >
                {item.icon}
                <span className="absolute left-16 bg-[#0c1322] border border-cyan-500/30 text-cyan-400 text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto">
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" title="System Online"></div>
        </div>
      </aside>
    </>
  );
}
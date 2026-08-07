import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import AIChat from "./components/AIChat";

function App() {
  return (
    <div className="relative min-h-screen bg-[#0f172a] selection:bg-cyan-400 selection:text-slate-900 text-slate-200">      
      {/* Background Effects (Tetap ada di setiap halaman) */}
      <div className="absolute inset-0 bg-cyber-grid z-0 pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] animate-glow z-0 pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px] animate-glow z-0 pointer-events-none" style={{ animationDelay: "2s" }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-glow z-0 pointer-events-none" style={{ animationDelay: "4s" }}></div>

      <Sidebar />

        {/* w-full dan ml-0 di HP, ml-20 di desktop. pt-20 di HP agar tidak tertutup nav atas */}
          <main className="relative z-10 w-full md:w-auto md:ml-20 flex flex-col items-center min-h-screen pt-20 md:pt-10">        
        {/* Di sinilah "Halaman" akan berganti-ganti */}
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/ai-chat" element={<AIChat />} />
        </Routes>
        
      </main>

    </div>
  );
}

export default App;
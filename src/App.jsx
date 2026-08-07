import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import AIChat from "./components/AIChat";
import AdminPanel from "./components/AdminPanel";

function App() {
  return (
    <div className="relative min-h-screen bg-[#0f172a] selection:bg-cyan-400 selection:text-slate-900 text-slate-200">
      
      {/* 
        PERBAIKAN 1: Background Effects Wrapper 
        Kita bungkus semua efek cahaya ke dalam div "fixed inset-0 overflow-hidden".
        Ini akan memotong (clip) cahaya yang meluber ke samping tanpa menyebabkan scrollbar.
      */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-cyber-grid"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] animate-glow"></div>
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px] animate-glow" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-glow" style={{ animationDelay: "4s" }}></div>
      </div>

      <Sidebar />

      {/* 
        PERBAIKAN 2: Koreksi Lebar Main Konten
        Menghapus 'w-full' dan menggantinya dengan 'w-full md:w-[calc(100%-5rem)]'
        Agar margin kiri (Sidebar) tidak mendorong layout keluar dari layar.
      */}
      <main className="relative z-10 w-full md:w-[calc(100%-5rem)] md:ml-20 flex flex-col items-center min-h-screen pt-20 md:pt-10">
        
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/admin-access-weli" element={<AdminPanel />} />
        </Routes>
        
      </main>

    </div>
  );
}

export default App;
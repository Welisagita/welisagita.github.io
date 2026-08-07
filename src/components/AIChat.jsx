import { useState, useRef, useEffect } from "react";
import { Send, Terminal, User, Sparkles } from "lucide-react";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { 
      role: "bot", 
      content: "System Initialized. Hello, I am Weli's AI Twin. I possess his complete resume, architecture blueprints, and contact logs. What would you like to know?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // KUNCI PERBAIKAN 1: Kita pasang referensi ini langsung ke kotak scroll-nya, bukan ke isinya.
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    // KUNCI PERBAIKAN 2: Kita menggunakan scrollTo pada kontainer spesifik.
    // Ini mencegah browser menarik seluruh halaman (body) ke atas/bawah secara paksa.
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Kunci scroll global
    window.scrollTo(0, 0); // Paksa layar ke posisi paling atas agar header tidak tersembunyi
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = { 
        role: "bot", 
        content: "I am currently in UI showcase mode. Once my backend neural link is established, I will answer queries based on Weli's professional logs. Please proceed with the database integration phase." 
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    // KUNCI PERBAIKAN 3: h-[calc(100vh-60px)] disesuaikan, dan pb-2 mengecilkan ruang bawah
    <section id="ai-chat" className="w-full max-w-4xl mx-auto px-4 flex flex-col h-[calc(100vh-60px)] pb-2">
      
      {/* Header */}
      <div className="mb-4 border-b border-cyan-900/50 pb-4 shrink-0">
        <h3 className="text-3xl font-bold text-white flex items-center gap-3">
          <Terminal className="text-cyan-400" size={32} />
          AI Twin Interface
        </h3>
        <p className="text-slate-400 mt-2 font-mono text-sm">
          Status: <span className="text-green-400 animate-pulse">Online & Monitoring</span>
        </p>
      </div>

      {/* Kotak Chat Utama */}
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl flex flex-col flex-1 min-h-0">
        
        {/* Area Pesan Chat (ref dipindahkan ke sini) */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "bot" && (
                <div className="w-8 h-8 rounded bg-cyan-900/50 border border-cyan-500/50 flex items-center justify-center shrink-0">
                  <Sparkles size={16} className="text-cyan-400" />
                </div>
              )}
              
              <div 
                className={`max-w-[80%] rounded-lg p-4 ${
                  msg.role === "user" 
                    ? "bg-blue-600/20 border border-blue-500/30 text-blue-100 rounded-tr-none" 
                    : "bg-slate-800/40 border border-slate-600/30 text-slate-200 rounded-tl-none"
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded bg-slate-800 border border-slate-600 flex items-center justify-center shrink-0">
                  <User size={16} className="text-slate-400" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 justify-start animate-[fadeIn_0.3s_ease-in-out]">
              <div className="w-8 h-8 rounded bg-cyan-900/50 border border-cyan-500/50 flex items-center justify-center shrink-0">
                <Sparkles size={16} className="text-cyan-400" />
              </div>
              <div className="bg-slate-800/40 border border-slate-600/30 rounded-lg rounded-tl-none p-4 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Area Input Chat */}
        <div className="p-4 border-t border-slate-700/50 bg-[#0c1322]/80 shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center">
            <Terminal size={20} className="absolute left-4 text-cyan-500/50" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI Twin a question..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-12 pr-14 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500 hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
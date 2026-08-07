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
  
  // ==========================================
  // URL CLOUDFLARE WORKER ANDA
  // ==========================================
  const WORKER_URL = "https://welisagita-github-io.sqrf-tech.workers.dev/"; 

  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
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
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0); 
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // ==========================================
  // FUNGSI CHAT KE GEMINI AI
  // ==========================================
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMessage = { role: "user", content: userText };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
      } else {
        throw new Error("Format respons tidak valid");
      }

    } catch (error) {
      console.error("AI Connection Error:", error);
      setMessages((prev) => [...prev, { 
        role: "bot", 
        content: "Neural link offline. I am currently unable to reach the cognitive core. Please try again later." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    // PERBAIKAN: Menggunakan dvh (Dynamic Viewport Height) dan menambah pb-6 untuk ruang aman di bawah HP
    <section id="ai-chat" className="w-full max-w-4xl mx-auto px-2 md:px-4 flex flex-col h-[calc(100dvh-70px)] md:h-[calc(100dvh-80px)] pb-6 md:pb-4 pt-4 md:pt-0">
      
      {/* Header (Sedikit dikecilkan marginnya di HP) */}
      <div className="mb-3 md:mb-4 border-b border-cyan-900/50 pb-3 md:pb-4 shrink-0">
        <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2 md:gap-3">
          <Terminal className="text-cyan-400" size={28} />
          AI Twin Interface
        </h3>
        <p className="text-slate-400 mt-1 md:mt-2 font-mono text-xs md:text-sm">
          Status: <span className="text-green-400 animate-pulse">Online & Linked</span>
        </p>
      </div>

      {/* Kotak Chat Utama */}
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl flex flex-col flex-1 min-h-0">
        
        {/* Area Pesan Chat (Padding disesuaikan untuk HP) */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 scrollbar-hide">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex gap-3 md:gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "bot" && (
                <div className="w-7 h-7 md:w-8 md:h-8 rounded bg-cyan-900/50 border border-cyan-500/50 flex items-center justify-center shrink-0">
                  <Sparkles size={14} className="text-cyan-400" />
                </div>
              )}
              
              <div 
                className={`max-w-[85%] md:max-w-[80%] rounded-lg p-3 md:p-4 ${
                  msg.role === "user" 
                    ? "bg-blue-600/20 border border-blue-500/30 text-blue-100 rounded-tr-none" 
                    : "bg-slate-800/40 border border-slate-600/30 text-slate-200 rounded-tl-none whitespace-pre-wrap"
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 md:w-8 md:h-8 rounded bg-slate-800 border border-slate-600 flex items-center justify-center shrink-0">
                  <User size={14} className="text-slate-400" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 md:gap-4 justify-start animate-[fadeIn_0.3s_ease-in-out]">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded bg-cyan-900/50 border border-cyan-500/50 flex items-center justify-center shrink-0">
                <Sparkles size={14} className="text-cyan-400" />
              </div>
              <div className="bg-slate-800/40 border border-slate-600/30 rounded-lg rounded-tl-none p-3 md:p-4 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Area Input Chat */}
        <div className="p-3 md:p-4 border-t border-slate-700/50 bg-[#0c1322]/80 shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center">
            <Terminal size={18} className="absolute left-3 md:left-4 text-cyan-500/50" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI Twin..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 md:py-3 pl-10 md:pl-12 pr-12 md:pr-14 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-xs md:text-sm"
              disabled={isTyping}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-1.5 md:right-2 p-1.5 md:p-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500 hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
import { Link } from "react-router-dom";
import { BrainCircuit, Code2, Database, Cloud, ShieldCheck, MessageCircle, Mail, User, UserPlus, Briefcase, Cpu, Terminal } from "lucide-react";

export default function Hero() {
  
  // Fungsi untuk men-download kontak (vCard)
  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:Sagita;Weli;;;
FN:Weli Sagita
TITLE:AI System Architect & Full-Stack Engineer
TEL;TYPE=CELL:+628119207940
EMAIL:welipalumbo@gmail.com
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Weli_Sagita.vcf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const techStack = [
    {
      id: "ai",
      title: "AI Systems & Automation",
      icon: <BrainCircuit className="text-cyan-400 animate-pulse" size={32} />,
      highlight: true, 
      desc: "Architecting autonomous agents and cognitive pipelines.",
      techs: ["RAG", "MCP", "LangGraph", "LiteLLM", "Agentic Workflow"]
    },
    {
      id: "se",
      title: "Software Engineering",
      icon: <Code2 className="text-blue-400" size={24} />,
      desc: "Robust backend infrastructure & APIs.",
      techs: ["Python", "FastAPI", "Async", "Clean Arch", "Pytest"]
    },
    {
      id: "data",
      title: "Data & Queue",
      icon: <Database className="text-indigo-400" size={24} />,
      desc: "High-performance data storage & task management.",
      techs: ["PostgreSQL", "Redis", "Vector DB", "Task Queue"]
    },
    {
      id: "devops",
      title: "DevOps & Cloud",
      icon: <Cloud className="text-emerald-400" size={24} />,
      desc: "Scalable container orchestration & deployment.",
      techs: ["Docker", "K8s (Kubernetes)", "Helm", "GitHub Actions", "AWS", "Terraform"]
    },
    {
      id: "ops",
      title: "Enterprise Ops",
      icon: <ShieldCheck className="text-purple-400" size={24} />,
      desc: "Security, observability, and cost governance.",
      techs: ["OAuth", "RBAC", "Grafana", "OpenTelemetry", "Audit", "Cost Ops"]
    }
  ];

  return (
    <section id="home" className="flex flex-col items-center justify-start min-h-screen px-4 md:px-16 w-full max-w-6xl mx-auto pb-24 pt-10 md:pt-16">
      
      {/* =========================================
          SECTION 1: THE NAME CARD 
          ========================================= */}
      <div className="glass-panel w-full max-w-5xl mx-auto rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.1)] relative overflow-hidden group">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-700"></div>

        <div className="relative shrink-0 mt-2 md:mt-0">
          <div className="w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden border border-slate-600 group-hover:border-cyan-400/80 transition-colors duration-500 relative z-10 bg-slate-800 flex items-center justify-center shadow-xl">
            <img 
              src="/foto-weli.jpg" 
              alt="Weli Sagita" 
              className="w-full h-full object-cover object-top grayscale opacity-90 group-hover:opacity-100 transition-opacity z-10"
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
            <User size={64} className="text-slate-600 absolute" />
          </div>
          
          <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-cyan-500/50 rounded-br-2xl pointer-events-none"></div>
          <div className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-2xl pointer-events-none"></div>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-2">
            Weli Sagita
          </h1>
          <h2 className="text-sm md:text-base text-cyan-400 font-mono tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] mb-8">
            &gt; AI SYSTEM ARCHITECT_
          </h2>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center md:justify-start w-full">
            
            {/* Tombol AI Chat (Baru) */}
            <Link 
              to="/ai-chat" 
              className="px-6 py-2.5 bg-indigo-500/10 border border-indigo-500/50 text-indigo-400 rounded hover:bg-indigo-500 hover:text-white transition-all font-semibold shadow-[0_0_15px_rgba(99,102,241,0.2)] flex items-center justify-center gap-2"
            >
              <Terminal size={18} /> Chat AI
            </Link>

            <a 
              href="https://wa.me/628119207940" 
              target="_blank" 
              rel="noreferrer" 
              className="px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 rounded hover:bg-emerald-500 hover:text-slate-900 transition-all font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>

            <a 
              href="mailto:welipalumbo@gmail.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded hover:bg-cyan-400 hover:text-slate-900 transition-all font-semibold shadow-[0_0_15px_rgba(34,211,238,0.2)] flex items-center justify-center gap-2"
            >
              <Mail size={18} /> Email
            </a>
            
            <button 
              onClick={handleSaveContact}
              className="px-6 py-2.5 glass-panel text-white rounded hover:bg-slate-800/50 transition-all border border-slate-700/50 hover:border-cyan-500/50 flex items-center justify-center gap-2"
            >
              <UserPlus size={18} /> Save Contact
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          SECTION 2: EXECUTIVE SUMMARY 
          ========================================= */}
      <div className="mt-20 w-full flex flex-col items-center">
        <div className="w-full max-w-5xl text-left mb-6 border-b border-cyan-900/50 pb-4">
          <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-cyan-400 font-mono text-xl drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">///</span> 
            Executive Summary
          </h3>
        </div>
        
        <div className="glass-panel w-full max-w-5xl p-6 md:p-8 rounded-xl border border-slate-700/50 shadow-lg">
          <p className="text-slate-300 text-sm md:text-base lg:text-lg leading-relaxed text-justify">
            Innovative <strong>Full-Stack Software Engineer</strong> with over 7 years of experience bridging robust backend infrastructure with highly responsive frontend architectures. Specializing in building scalable web applications, API integrations, and <strong>autonomous AI workflows</strong>. Highly proficient in modern AI-assisted coding paradigms (utilizing tools like <span className="text-cyan-300 font-semibold">Claude</span> and <span className="text-cyan-300 font-semibold">Copilot</span>) to rapidly prototype and deploy complex systems. I am eager to leverage my expertise as a versatile generalist to build data pipelines, internal dashboards, and user-facing tools that accelerate machine learning research and product development.
          </p>
        </div>
      </div>

      {/* =========================================
          SECTION 3: TECH STACK MATRIX
          ========================================= */}
      <div className="mt-20 w-full flex flex-col items-center">
        <div className="mb-10 border-b border-cyan-900/50 pb-4 w-full max-w-5xl text-left">
          <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-cyan-400 font-mono text-xl drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">///</span> 
            Engineering Matrix
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {techStack.map((stack) => (
            <div 
              key={stack.id} 
              className={`glass-panel p-6 rounded-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left border ${
                stack.highlight 
                  ? "md:col-span-2 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.15)] bg-cyan-950/10" 
                  : "border-slate-700/50 hover:border-cyan-500/30"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${stack.highlight ? "bg-cyan-900/40" : "bg-slate-800/50"}`}>
                  {stack.icon}
                </div>
                <h4 className={`text-xl font-bold ${stack.highlight ? "text-cyan-300" : "text-slate-100"}`}>
                  {stack.title}
                </h4>
              </div>
              <p className="text-slate-400 text-sm mb-5 font-mono">
                {stack.desc}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {stack.techs.map((t, i) => (
                  <span 
                    key={i} 
                    className={`px-3 py-1 text-xs font-mono rounded border ${
                      stack.highlight 
                        ? "bg-cyan-900/30 text-cyan-200 border-cyan-700/50" 
                        : "bg-slate-800 text-slate-300 border-slate-600"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================
          SECTION 4: CALL TO ACTION (Bottom Navigation)
          ========================================= */}
      <div className="mt-20 w-full max-w-5xl flex flex-col items-end">
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-end">
          <Link 
            to="/experience" 
            className="px-8 py-4 bg-slate-800/50 border border-cyan-500/30 text-slate-200 rounded-lg hover:bg-cyan-900/30 hover:border-cyan-400 hover:text-cyan-300 transition-all font-semibold shadow-lg flex items-center justify-center gap-3 w-full sm:w-auto group"
          >
            <Briefcase size={20} className="group-hover:text-cyan-400 transition-colors" /> 
            Professional Experience 
          </Link>
          
          <Link 
            to="/projects" 
            className="px-8 py-4 bg-cyan-600/10 border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-slate-900 transition-all font-semibold shadow-[0_0_20px_rgba(34,211,238,0.2)] flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            <Cpu size={20} /> 
            View Architectures
          </Link>
        </div>
      </div>

    </section>
  );
}
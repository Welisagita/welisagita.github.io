import { Link } from "react-router-dom";
import { BrainCircuit, Code2, Database, Cloud, ShieldCheck, ChevronRight } from "lucide-react";

export default function Hero() {
  
  // Data Tech Stack Matrix Anda
  const techStack = [
    {
      id: "ai",
      title: "AI Systems & Automation",
      icon: <BrainCircuit className="text-cyan-400 animate-pulse" size={32} />,
      highlight: true, // Kartu ini akan mendapat efek visual spesial
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
    <section id="home" className="flex flex-col items-center justify-start min-h-screen text-center px-4 md:px-16 w-full max-w-6xl mx-auto pb-20">
      
      {/* --- HERO SECTION (Bagian Atas) --- */}
      <div className="flex flex-col items-center justify-center pt-10 md:pt-20">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-3 md:mb-4 tracking-tight">
          Weli Sagita
        </h1>
        
        <h2 className="text-xs md:text-lg lg:text-xl text-cyan-400 font-mono tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] mb-8 md:mb-10">
          &gt; AI SYSTEM ARCHITECT & FULL-STACK ENGINEER_
        </h2>
        
        <p className="text-slate-300 max-w-4xl text-sm md:text-base lg:text-lg leading-relaxed text-justify md:text-center">
          Innovative <strong>Full-Stack Software Engineer</strong> with over 7 years of experience bridging robust backend infrastructure with highly responsive frontend architectures. Specializing in building scalable web applications, API integrations, and <strong>autonomous AI workflows</strong>. Highly proficient in modern AI-assisted coding paradigms (utilizing tools like <span className="text-cyan-300 font-semibold">Claude</span> and <span className="text-cyan-300 font-semibold">Copilot</span>) to rapidly prototype and deploy complex systems. I am eager to leverage my expertise as a versatile generalist to build data pipelines, internal dashboards, and user-facing tools that accelerate machine learning research and product development.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a href="mailto:welipalumbo@gmail.com" className="w-full sm:w-auto px-8 py-3 bg-cyan-500/10 border border-cyan-400 text-cyan-400 rounded hover:bg-cyan-400 hover:text-slate-900 transition-all font-semibold shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2">
            Initiate Contact <ChevronRight size={18} />
          </a>
          <Link to="/projects" className="w-full sm:w-auto px-8 py-3 glass-panel text-white rounded hover:bg-slate-800/50 transition-all border border-slate-700/50 hover:border-cyan-500/50 flex items-center justify-center gap-2">
            View Architectures
          </Link>
        </div>
      </div>

      {/* --- TECH STACK MATRIX SECTION (Bagian Bawah) --- */}
      <div className="mt-24 w-full flex flex-col items-center">
        <div className="mb-10 border-b border-cyan-900/50 pb-4 w-full max-w-4xl text-left">
          <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-cyan-400 font-mono text-xl drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">///</span> 
            Engineering Matrix
          </h3>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          
          {techStack.map((stack) => (
            <div 
              key={stack.id} 
              // Jika ini AI (highlight), buat kotaknya membentang 2 kolom di tablet/desktop dan berikan border nyala
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

    </section>
  );
}
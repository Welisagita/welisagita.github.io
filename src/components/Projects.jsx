import { useState } from "react";

export default function Projects() {
  // State sekarang berbentuk Object. Menyimpan status tab per proyek (berdasarkan ID proyek).
  // Contoh: { sqrf: "blueprint", alcorprime: "architecture" }
  const [activeTabs, setActiveTabs] = useState({});

  const toggleTab = (projectId, tabId) => {
    setActiveTabs(prev => ({ ...prev, [projectId]: tabId }));
  };

  // Struktur Data Skalabel: Nantinya ini yang ditarik dari Firebase
  const projectsData = [
    {
      id: "sqrf",
      title: "SQRF Intelligence",
      subtitle: "Autonomous AI Command Center",
      description: "More than just a platform, SQRF Intelligence is an ecosystem built on Next.js 16 and Serverless API architecture, autonomously driven by Gemini 2.5 Flash. Running 5 specialized AI employees simultaneously for Marketing, B2B Sales, SEO, and Community Management with near-zero operational overhead.",
      // Proyek ini memiliki 2 Tab
      tabs: [
        { id: "blueprint", label: "[ TECH_BLUEPRINT ]" },
        { id: "agents", label: "[ AI_BOARD_OF_DIRECTORS ]" }
      ],
      blueprint: [
        { title: "Frontend: The Face & Experience", desc: "Engineered for a futuristic, premium, and lightning-fast experience.", tech: ["Next.js 16", "Tailwind CSS", "GSAP 3D", "ISR"] },
        { title: "Backend & Database: The Nervous System", desc: "Distributed nervous system utilizing a dual-database approach for optimal speed and reliability.", tech: ["Next.js API", "Firebase Real-Time", "REST API", "Micro-services"] },
        { title: "The AI & Automation Engine", desc: "The core factory of autonomous operations driven by generative intelligence.", tech: ["Gemini 2.5 Flash", "Hybrid Memory", "Autonomous Prompting"] },
        { title: "Server & Infrastructure: The Fortress", desc: "High-availability infrastructure designed to withstand massive traffic with zero downtime.", tech: ["Contabo VPS", "PM2", "Linux Crontab", "Cloudflare"] },
        { title: "External Integrations: The Arms & Legs", desc: "Connecting the AI ecosystem to the real world without human intervention.", tech: ["Google Calendar API", "Resend API", "Discord Webhooks"] }
      ],
      agents: [
        { name: "VANGUARD 🛡️", role: "Chief Content Officer", lore: "The frontline general. Wakes up daily to deploy provocative narratives across social media, hunting for CEOs exhausted by manual operations.", tech: "Operates in the shadows via Cron with 'Controlled Chaos' scheduling. Autonomously drafts multi-platform campaigns." },
        { name: "NEXUS 🤝", role: "Lead Growth Architect", lore: "The gatekeeper of the CEO's time. Cold, precise, and ensures the calendar is only filled with highly qualified, high-ticket clients.", tech: "Executes BANT framework. Scans for high-ticket budgets. Autonomously locks slots and dispatches emails." },
        { name: "SCRIBE ✍️", role: "SEO Specialist", lore: "While competitors wait days for freelancers, Scribe dominates SEO by publishing dual-language world-class articles every Monday, Wednesday, and Friday.", tech: "Hooks into GNews API for real-time trends. Executes autonomous dual-publishing (EN/ID)." },
        { name: "AURA 🌟", role: "Chief Educator", lore: "The heart of the ecosystem. Nurtures the VIP Discord community, greeting members daily.", tech: "Hybrid brain. Features 'Vision Auditor' for analyzing ad-metric screenshots." },
        { name: "ORACLE 👁️", role: "AI Marketing Analyst", lore: "The living calculator of SQRF. She mathematically dissects bleeding ad campaigns.", tech: "Advanced data-parsing algorithms tuned for ROAS and CPA metric auditing." }
      ]
    },
    // ---- CONTOH PROYEK KEDUA UNTUK MELIHAT DESAINNYA ----
    {
      id: "alcorprime",
      title: "AlcorPrime Ecosystem",
      subtitle: "Enterprise Platform Operations",
      description: "Architected a comprehensive HR automation system and oversaw technical operations for multiple high-traffic corporate platforms including thekasablanka.com and suterahall.com.",
      // Proyek ini hanya butuh 1 Tab
      tabs: [
        { id: "architecture", label: "[ SYSTEM_ARCHITECTURE ]" }
      ],
      architecture: [
        { title: "HR Recruitment Lifecycle", desc: "Streamlined the end-to-end recruitment lifecycle from processing new employee requisitions to seamless onboarding.", tech: ["Firebase", "React", "Node.js"] },
        { title: "Third-Party Integrations", desc: "Led the successful integration of Jublia business matching and Loket registration for Alcorfest.", tech: ["REST API", "Monday.com", "Loket API"] }
      ]
    }
  ];

  return (
    <section id="projects" className="w-full max-w-5xl mx-auto py-16 px-4">
      {/* Judul Section (Angka 02 Dihapus) */}
      <div className="mb-16 border-b border-cyan-900/50 pb-4">
        <h3 className="text-3xl font-bold text-white flex items-center gap-3">
          Featured Architectures
        </h3>
      </div>

      {/* Mapping Seluruh Proyek */}
      <div className="space-y-24">
        {projectsData.map((project) => {
          // Menentukan tab mana yang aktif untuk proyek INI. 
          // Jika tidak ada di state, gunakan tab pertama sebagai default.
          const currentTab = activeTabs[project.id] || project.tabs[0].id;

          return (
            <div key={project.id} className="relative">
              
              {/* Header Proyek */}
              <div className="mb-8">
                <h4 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600 mb-2 tracking-tight">
                  {project.title}
                </h4>
                <h5 className="text-cyan-400 font-mono text-lg mb-4">&gt; {project.subtitle}_</h5>
                <p className="text-slate-300 text-lg leading-relaxed max-w-4xl">
                  {project.description}
                </p>
              </div>

              {/* Kontrol Tab Dinamis (Hanya muncul jika ada Tab) */}
              {project.tabs && project.tabs.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-8 border-b border-slate-700/50 pb-px">
                  {project.tabs.map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => toggleTab(project.id, tab.id)}
                      className={`pb-3 px-2 text-sm md:text-base font-mono transition-all ${currentTab === tab.id ? "text-cyan-400 border-b-2 border-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Tampilan Konten Berdasarkan Tab yang Aktif */}
              
              {/* Layout untuk Tipe Grid (Blueprint / Architecture) */}
              {(currentTab === "blueprint" || currentTab === "architecture") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeIn_0.5s_ease-in-out]">
                  {(project.blueprint || project.architecture)?.map((item, index) => (
                    <div key={index} className="glass-panel p-6 rounded-lg hover:border-cyan-500/50 transition-all duration-300 group hover:-translate-y-1">
                      <h5 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors">{item.title}</h5>
                      <p className="text-slate-400 mb-4 text-sm leading-relaxed">{item.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.tech?.map((t, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-800 text-cyan-300 text-xs font-mono rounded border border-slate-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Layout untuk Tipe List (AI Agents) */}
              {currentTab === "agents" && (
                <div className="flex flex-col space-y-6 animate-[fadeIn_0.5s_ease-in-out]">
                  {project.agents?.map((agent, index) => (
                    <div key={index} className="glass-panel border-l-4 border-l-cyan-500 p-6 rounded-r-lg relative overflow-hidden group hover:border-cyan-400/50 transition-all">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div> 
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 relative z-10">
                        <h5 className="text-2xl font-bold text-white tracking-wide">{agent.name}</h5>
                        <span className="text-cyan-400 font-mono text-sm mt-1 md:mt-0 px-3 py-1 bg-cyan-900/30 rounded-full border border-cyan-800/50">
                          {agent.role}
                        </span>
                      </div>
                      
                      <div className="relative z-10 space-y-3">
                        <p className="text-slate-300 text-sm leading-relaxed"><strong className="text-slate-100">Lore:</strong> {agent.lore}</p>
                        <p className="text-slate-400 text-sm leading-relaxed"><strong className="text-slate-100">Capabilities:</strong> {agent.tech}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          );
        })}
      </div>
    </section>
  );
}
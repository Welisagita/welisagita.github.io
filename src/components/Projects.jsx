import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Tambahan untuk navigasi
import { Terminal, ExternalLink, DatabaseBackup, Loader2, Home, Briefcase } from "lucide-react"; // Tambahan ikon Home & Briefcase
import { db } from "../firebase"; 
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

export default function Projects() {
  const [activeTabs, setActiveTabs] = useState({});
  const [projectsData, setProjectsData] = useState([]); // State sekarang kosong, menunggu dari Firebase
  const [isLoading, setIsLoading] = useState(true);

  const toggleTab = (projectId, tabId) => {
    setActiveTabs(prev => ({ ...prev, [projectId]: tabId }));
  };

  // 1. DATA LOKAL (Kita simpan sementara hanya untuk proses migrasi)
  const localProjectsData = [
    {
      id: "sqrf",
      title: "SQRF Intelligence",
      subtitle: "Autonomous AI Command Center",
      description: "More than just a platform, SQRF Intelligence is an ecosystem built on Next.js 16 and Serverless API architecture, autonomously driven by Gemini 2.5 Flash. Running 5 specialized AI employees simultaneously for Marketing, B2B Sales, SEO, and Community Management with near-zero operational overhead.",
      liveUrl: "https://getsqrf.com", 
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
    {
      id: "alcorprime",
      title: "AlcorPrime Ecosystem",
      subtitle: "Enterprise Platform Operations",
      description: "Architected a comprehensive HR automation system and oversaw technical operations for multiple high-traffic corporate platforms including thekasablanka.com and suterahall.com.",
      liveUrl: "https://alcorprime.com", 
      tabs: [
        { id: "architecture", label: "[ SYSTEM_ARCHITECTURE ]" }
      ],
      architecture: [
        { title: "HR Recruitment Lifecycle", desc: "Streamlined the end-to-end recruitment lifecycle from processing new employee requisitions to seamless onboarding.", tech: ["Firebase", "React", "Node.js"] },
        { title: "Third-Party Integrations", desc: "Led the successful integration of Jublia business matching and Loket registration for Alcorfest.", tech: ["REST API", "Monday.com", "Loket API"] }
      ]
    }
  ];

  // 2. FUNGSI FETCH: Menarik data dari Firestore secara dinamis
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const fetchedProjects = [];
        querySnapshot.forEach((doc) => {
          fetchedProjects.push({ id: doc.id, ...doc.data() });
        });
        
        setProjectsData(fetchedProjects);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 3. FUNGSI MIGRASI: Mengirim data lokal ke Firestore
  const handleMigrateData = async () => {
    try {
      setIsLoading(true);
      for (const project of localProjectsData) {
        // Menggunakan setDoc agar ID dokumen sama dengan ID project (sqrf, alcorprime)
        await setDoc(doc(db, "projects", project.id), project);
      }
      alert("✅ Data Berhasil Dimigrasi ke Firebase!");
      window.location.reload(); // Refresh halaman untuk melihat data baru
    } catch (error) {
      console.error("Migration failed:", error);
      alert("❌ Migrasi Gagal! Periksa aturan akses (rules) Firestore Anda.");
      setIsLoading(false);
    }
  };

  return (
    <section id="projects" className="w-full max-w-5xl mx-auto py-16 px-4">
      
      <div className="mb-16 border-b border-cyan-900/50 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold text-white flex items-center gap-3">
            Featured Architectures
          </h3>
          <p className="text-slate-400 font-mono text-sm mt-1">&gt; Production-grade systems & cognitive pipelines_</p>
        </div>

        {/* TOMBOL MIGRASI RAHASIA (Nanti kita hapus setelah berhasil) */}
        {projectsData.length === 0 && !isLoading && (
          <button 
            onClick={handleMigrateData}
            className="px-4 py-2 bg-purple-600/20 border border-purple-500 text-purple-300 rounded hover:bg-purple-600 hover:text-white transition-colors flex items-center gap-2 text-sm font-mono animate-pulse"
          >
            <DatabaseBackup size={16} /> Force Migrate Database
          </button>
        )}
      </div>

      {/* TAMPILAN LOADING */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-cyan-400 gap-4">
          <Loader2 size={48} className="animate-spin" />
          <p className="font-mono text-sm animate-pulse">Establishing secure link to Firestore...</p>
        </div>
      )}

      {/* TAMPILAN KOSONG */}
      {!isLoading && projectsData.length === 0 && (
        <div className="glass-panel p-10 text-center rounded-2xl border border-red-500/30">
          <p className="text-red-400 font-mono text-lg">⚠️ NO DATA FOUND IN FIREBASE.</p>
          <p className="text-slate-400 mt-2 text-sm">Please click the 'Force Migrate Database' button above to seed the initial data.</p>
        </div>
      )}

      {/* TAMPILAN DATA PROYEK */}
      {!isLoading && projectsData.length > 0 && (
        <div className="space-y-24">
          {projectsData.map((project) => {
            const currentTab = activeTabs[project.id] || project.tabs[0].id;

            return (
              <div key={project.id} className="relative glass-panel p-6 md:p-10 rounded-2xl border border-slate-700/50">
                
                <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div>
                    <h4 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600 mb-2 tracking-tight">
                      {project.title}
                    </h4>
                    <h5 className="text-cyan-400 font-mono text-sm md:text-base mb-4">&gt; {project.subtitle}_</h5>
                    <p className="text-slate-300 text-base leading-relaxed max-w-3xl">
                      {project.description}
                    </p>
                  </div>

                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="px-5 py-2.5 bg-cyan-500/10 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-slate-900 transition-all font-semibold shadow-[0_0_15px_rgba(34,211,238,0.2)] flex items-center justify-center gap-2 shrink-0 text-sm font-mono"
                    >
                      Live Project <ExternalLink size={16} />
                    </a>
                  )}
                </div>

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

                {(currentTab === "blueprint" || currentTab === "architecture") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeIn_0.5s_ease-in-out]">
                    {(project.blueprint || project.architecture)?.map((item, index) => (
                      <div key={index} className="bg-slate-900/40 border border-slate-700/40 p-6 rounded-lg hover:border-cyan-500/50 transition-all duration-300 group hover:-translate-y-1">
                        <h5 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors">{item.title}</h5>
                        <p className="text-slate-400 mb-4 text-sm leading-relaxed">{item.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.tech?.map((t, i) => (
                            <span key={i} className="px-2.5 py-1 bg-slate-800 text-cyan-300 text-xs font-mono rounded border border-slate-700">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {currentTab === "agents" && (
                  <div className="flex flex-col space-y-6 animate-[fadeIn_0.5s_ease-in-out]">
                    {project.agents?.map((agent, index) => (
                      <div key={index} className="bg-slate-900/40 border border-slate-700/40 border-l-4 border-l-cyan-500 p-6 rounded-r-lg relative overflow-hidden group hover:border-cyan-400/50 transition-all">
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
      )}

      {/* =========================================
          BOTTOM NAVIGATION (Tambahan Baru)
          ========================================= */}
      {!isLoading && projectsData.length > 0 && (
        <div className="mt-20 border-t border-cyan-900/50 pt-10 flex flex-col sm:flex-row gap-6 w-full justify-end">
          {/* Tombol lanjut ke Chat AI */}
          <Link 
              to="/ai-chat" 
              className="px-4 py-2.5 bg-indigo-500/10 border border-indigo-500/50 text-indigo-400 rounded hover:bg-indigo-500 hover:text-white transition-all font-semibold shadow-[0_0_15px_rgba(99,102,241,0.2)] flex items-center justify-center gap-2"
            >
              <Terminal size={18} /> Chat AI
            </Link>
          {/* Tombol kembali ke Profile (Hero) */}
          <Link 
            to="/" 
            className="px-8 py-4 bg-slate-800/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-700/50 hover:text-white transition-all font-semibold flex items-center justify-center gap-3 w-full sm:w-auto group"
          >
            <Home size={20} className="text-slate-400 group-hover:text-white transition-colors" /> 
            Back to Profile
          </Link>
          
          {/* Tombol lanjut ke Experience */}
          <Link 
            to="/experience" 
            className="px-8 py-4 bg-cyan-600/10 border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-slate-900 transition-all font-semibold shadow-[0_0_20px_rgba(34,211,238,0.2)] flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            <Briefcase size={20} /> 
            View Experience
          </Link>
        </div>
      )}

    </section>
  );
}
import { useState } from "react";

export default function Experience() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Original data to be migrated to Firebase backend later
  const experiences = [
    { 
      id: 1, 
      year: "2023 - Present",
      role: "AI System Architect & Developer", 
      company: "Personal Enterprise (getsqrf.com)", 
      desc: "Engineered a fully autonomous AI-driven platform utilizing Next.js and Firebase. Designed Multi-Agent Workflows capable of autonomously writing articles, curating content, resolving complaints, and scheduling. Leveraged generative AI APIs and prompt engineering to create context-aware agents." 
    },
    { 
      id: 2, 
      year: "2023 - Present",
      role: "Software Engineer & Technical Specialist", 
      company: "PT. Wahana Inspirasi Bintang", 
      desc: "Architected a comprehensive HR automation system using Firebase. Oversaw technical operations for high-traffic corporate platforms (alcorprime.com, etc). Led the integration of Jublia and Loket for Alcorfest, and interfaced workflows with Monday.com." 
    },
    { 
      id: 3, 
      year: "2020 - Present",
      role: "Full-Stack Web Developer", 
      company: "insidejob.id", 
      desc: "Developed highly scalable platforms including e-commerce sites (Ramuraga, Arkatama Group). Engineered a custom LMS for Dams Institute and built engaging portals for NGOs like Perempuan Laut and Dietplastik Indonesia." 
    },
    { 
      id: 4, 
      year: "2021 - 2023",
      role: "Web Developer", 
      company: "Cyberlink Networks", 
      desc: "Managed high-availability corporate WordPress sites. Conducted SEO audits, managed a Mikrotik tutorial LMS, and integrated HubSpot CRM for effective lead management." 
    },
    { 
      id: 5, 
      year: "2020 - 2021",
      role: "Web Developer & Digital Marketing", 
      company: "PT. Azzam Albaesuni", 
      desc: "Created and maintained the travel website www.toyibtravel.co.id. Executed SEO strategies and managed social media ad campaigns to drive traffic." 
    },
    { 
      id: 6, 
      year: "2018 - 2020",
      role: "Front-End Engineer", 
      company: "PT. Erbe Broker Indonesia", 
      desc: "Developed the payment gateway website www.asuransijagoan.com and associated insurance applications while supervising team members." 
    }
  ];

  return (
    <section id="experience" className="w-full max-w-4xl mx-auto py-16 px-4">
      <h3 className="text-2xl font-bold text-white mb-8 border-b border-cyan-900/50 pb-4 flex items-center gap-3">
        Professional Experience
      </h3>
      
      <div className="space-y-6">
        {experiences.map((item, index) => (
          <div 
            key={item.id} 
            className="glass-panel rounded-lg overflow-hidden transition-all duration-300 border border-slate-700/50 hover:border-cyan-500/50 group"
          >
            <button 
              onClick={() => toggleOpen(index)}
              className="w-full px-6 py-5 text-left flex flex-col md:flex-row md:justify-between md:items-center hover:bg-cyan-500/10 transition-colors gap-2"
            >
              <div>
                <span className="font-semibold text-lg text-slate-100 block group-hover:text-cyan-300 transition-colors">
                  {item.role} 
                </span>
                <span className="text-cyan-500 text-sm md:text-base font-medium">@ {item.company}</span>
              </div>
              
              <div className="flex items-center gap-4 mt-3 md:mt-0">
                {/* Year Badge */}
                <span className="text-slate-400 text-sm font-mono bg-slate-900/60 px-3 py-1 rounded-full border border-slate-700/50">
                  {item.year}
                </span>
                {/* Terminal style [+] [-] */}
                <span className="text-cyan-400 font-mono hidden md:inline-block text-lg w-6 text-center">
                  {openIndex === index ? "[-]" : "[+]"}
                </span>
              </div>
            </button>
            
            {/* Dropdown Content */}
            {openIndex === index && (
              <div className="px-6 py-6 text-slate-300 border-t border-cyan-900/30 bg-slate-900/40 backdrop-blur-md animate-[fadeIn_0.3s_ease-in-out]">
                <p className="leading-relaxed text-sm md:text-base text-justify md:text-left">
                  {item.desc}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
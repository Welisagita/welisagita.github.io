import { useState, useEffect } from "react";
import { DatabaseBackup, Loader2 } from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

export default function Experience() {
  const [openIndex, setOpenIndex] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // 1. DATA LOKAL (Kita simpan sementara hanya untuk proses migrasi awal)
  const localExperiencesData = [
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
    }
  ];

  // 2. FUNGSI FETCH
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "experiences"));
        const fetchedExperiences = [];
        querySnapshot.forEach((doc) => {
          fetchedExperiences.push(doc.data());
        });
        fetchedExperiences.sort((a, b) => a.id - b.id);
        setExperiences(fetchedExperiences);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  // 3. FUNGSI MIGRASI
  const handleMigrateData = async () => {
    try {
      setIsLoading(true);
      for (const item of localExperiencesData) {
        await setDoc(doc(db, "experiences", `exp-${item.id}`), item);
      }
      alert("✅ Data Experience Berhasil Dimigrasi ke Firebase!");
      window.location.reload(); 
    } catch (error) {
      alert("❌ Migrasi Gagal! Periksa aturan akses Firestore Anda.");
      setIsLoading(false);
    }
  };

  // ==========================================================
  // 4. PARSER TEKS DINAMIS (Untuk memisahkan Bullet/Angka)
  // ==========================================================
  const formatDescription = (text) => {
    if (!text) return null;
    
    // Pisahkan teks berdasarkan enter (ganti baris)
    const lines = text.split('\n');
    
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      // Jika baris kosong, beri jarak (spasi)
      if (!trimmed) return <div key={idx} className="h-3"></div>;

      // Deteksi apakah baris diawali dengan peluru (•, ●, *, -) atau angka (1., 2.) ditambah spasi
      const match = trimmed.match(/^([•●\*\-]|\d+\.)\s+(.*)/);
      
      if (match) {
        const bulletOrNumber = match[1]; // Mengambil simbol peluru/angkanya
        const content = match[2];        // Mengambil isi teksnya

        return (
          <div key={idx} className="flex items-start gap-3 mb-3">
            {/* Ikon/Angka dilock ukurannya (shrink-0) agar tidak mengecil */}
            <span className="shrink-0 text-cyan-400 mt-0.5 font-mono">
              {bulletOrNumber}
            </span>
            {/* Teks utama bebas membungkus (wrap) dengan margin yang rapi */}
            <span className="leading-relaxed">
              {content}
            </span>
          </div>
        );
      }

      // Jika tidak ada peluru, render sebagai paragraf biasa
      return (
        <p key={idx} className="mb-3 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  // ==========================================================
  // RENDER UI
  // ==========================================================
  return (
    <section id="experience" className="w-full max-w-4xl mx-auto py-16 px-4">
      
      {/* HEADER SECTION */}
      <div className="mb-8 border-b border-cyan-900/50 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          Professional Experience
        </h3>

        {experiences.length === 0 && !isLoading && (
          <button 
            onClick={handleMigrateData}
            className="px-4 py-2 bg-purple-600/20 border border-purple-500 text-purple-300 rounded hover:bg-purple-600 hover:text-white transition-colors flex items-center gap-2 text-sm font-mono animate-pulse"
          >
            <DatabaseBackup size={16} /> Force Migrate Database
          </button>
        )}
      </div>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-cyan-400 gap-4">
          <Loader2 size={48} className="animate-spin" />
          <p className="font-mono text-sm animate-pulse">Syncing logs with Firestore...</p>
        </div>
      )}

      {!isLoading && experiences.length === 0 && (
        <div className="glass-panel p-10 text-center rounded-2xl border border-red-500/30">
          <p className="text-red-400 font-mono text-lg">⚠️ CORE LOGS NOT FOUND.</p>
        </div>
      )}

      {/* TAMPILAN DATA EXPERIENCE */}
      {!isLoading && experiences.length > 0 && (
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
                
                {/* PERBAIKAN: Layout diubah agar di HP saling berjauhan (justify-between) dan icon tidak disembunyikan */}
                <div className="flex items-center justify-between w-full md:w-auto mt-3 md:mt-0 md:gap-4">
                  <span className="text-slate-400 text-sm font-mono bg-slate-900/60 px-3 py-1 rounded-full border border-slate-700/50">
                    {item.year}
                  </span>
                  <span className="text-cyan-400 font-mono text-lg w-6 text-center">
                    {openIndex === index ? "[-]" : "[+]"}
                  </span>
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 py-6 text-slate-300 border-t border-cyan-900/30 bg-slate-900/40 backdrop-blur-md animate-[fadeIn_0.3s_ease-in-out]">
                  
                  {/* Pemanggilan Parser Teks Dinamis di sini */}
                  <div className="text-sm md:text-base text-left">
                    {formatDescription(item.desc)}
                  </div>
                  
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
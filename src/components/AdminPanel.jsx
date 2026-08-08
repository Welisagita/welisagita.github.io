import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { Lock, LayoutDashboard, Briefcase, LogOut, Plus, Edit, Trash2, Loader2, X, Save, Layers, ArrowLeft, PlusCircle } from "lucide-react";

export default function AdminPanel() {
  // ==========================================
  // STATE: AUTHENTICATION
  // ==========================================
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ==========================================
  // STATE: GENERAL SYSTEM
  // ==========================================
  const [activeMenu, setActiveMenu] = useState("projects");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // ==========================================
  // STATE: PROJECTS (ARCHITECTURES)
  // ==========================================
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); 
  const initialFormState = { id: "", title: "", subtitle: "", description: "", liveUrl: "" };
  const [formData, setFormData] = useState(initialFormState);
  
  const [contentProject, setContentProject] = useState(null); 
  const [newTab, setNewTab] = useState({ id: "", label: "" });
  const [newItem, setNewItem] = useState({ title: "", desc: "", tech: "", name: "", role: "", lore: "" });
  const [activeContentSection, setActiveContentSection] = useState("blueprint"); // Tab virtual di admin

  // ==========================================
  // STATE: EXPERIENCES (CORE LOGS)
  // ==========================================
  const [experiences, setExperiences] = useState([]);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const expInitialState = { id: "", year: "", role: "", company: "", desc: "" };
  const [expFormData, setExpFormData] = useState(expInitialState);

  // ==========================================
  // FUNGSI AUTH (FIREBASE AUTHENTICATION)
  // ==========================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setErrorMsg("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login Gagal:", error);
      setErrorMsg("⚠️ Access Denied: Invalid Credentials.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error saat logout:", error);
    }
  };

  // ==========================================
  // FUNGSI FETCH DATA
  // ==========================================
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const data = [];
      querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setProjects(data);
    } catch (error) { console.error(error); } 
    finally { setIsLoading(false); }
  };

  const fetchExperiences = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "experiences"));
      const data = [];
      querySnapshot.forEach((doc) => data.push({ docId: doc.id, ...doc.data() }));
      data.sort((a, b) => Number(a.id) - Number(b.id));
      setExperiences(data);
    } catch (error) { console.error(error); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (activeMenu === "projects") fetchProjects();
      if (activeMenu === "experience") fetchExperiences();
    }
  }, [isAuthenticated, activeMenu]);

  // ==========================================
  // FUNGSI CRUD: EXPERIENCES
  // ==========================================
  const handleSaveExperience = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const expIdNumber = Number(expFormData.id);
      const docId = `exp-${expIdNumber}`;
      const dataToSave = {
        id: expIdNumber,
        year: expFormData.year,
        role: expFormData.role,
        company: expFormData.company,
        desc: expFormData.desc
      };
      await setDoc(doc(db, "experiences", docId), dataToSave);
      setIsExpModalOpen(false);
      fetchExperiences();
    } catch (error) { alert("❌ Gagal menyimpan data experience."); }
    finally { setIsSaving(false); }
  };

  const handleDeleteExperience = async (docId, role) => {
    if (!window.confirm(`Hapus log pekerjaan "${role}"?`)) return;
    try {
      await deleteDoc(doc(db, "experiences", docId));
      setExperiences(experiences.filter(exp => exp.docId !== docId));
    } catch (error) { alert("❌ Gagal menghapus log."); }
  };

  // ==========================================
  // FUNGSI CRUD: PROJECTS (BASIC INFO)
  // ==========================================
  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Hapus proyek "${title}" secara permanen?`)) return;
    try {
      await deleteDoc(doc(db, "projects", id));
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) { alert("❌ Gagal menghapus proyek."); }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!formData.id.trim()) return alert("Project ID tidak boleh kosong!");
    setIsSaving(true);
    try {
      if (modalMode === "add") {
        await setDoc(doc(db, "projects", formData.id), { ...formData, tabs: [], blueprint: [], agents: [], architecture: [] });
      } else {
        await updateDoc(doc(db, "projects", formData.id), {
          title: formData.title, subtitle: formData.subtitle, description: formData.description, liveUrl: formData.liveUrl
        });
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) { alert("❌ Gagal menyimpan."); } 
    finally { setIsSaving(false); }
  };

  // ==========================================
  // FUNGSI CRUD: DEEP CONTENT MANAGER
  // ==========================================
  const updateProjectArray = async (arrayName, newArrayData) => {
    try {
      await updateDoc(doc(db, "projects", contentProject.id), { [arrayName]: newArrayData });
      setContentProject({ ...contentProject, [arrayName]: newArrayData });
      setProjects(projects.map(p => p.id === contentProject.id ? { ...p, [arrayName]: newArrayData } : p));
    } catch (error) { alert(`❌ Gagal memperbarui ${arrayName}`); }
  };

  const handleAddTab = () => {
    if (!newTab.id || !newTab.label) return alert("Wajib diisi!");
    updateProjectArray("tabs", [...(contentProject.tabs || []), newTab]);
    setNewTab({ id: "", label: "" });
  };

  const handleRemoveTab = (tabId) => {
    if(window.confirm("Hapus tab ini?")) updateProjectArray("tabs", contentProject.tabs.filter(t => t.id !== tabId));
  };

  const handleAddItem = (arrayName) => {
    const techArray = newItem.tech ? newItem.tech.split(",").map(t => t.trim()).filter(t => t !== "") : [];
    let itemToSave = arrayName === "agents" 
      ? { name: newItem.name, role: newItem.role, lore: newItem.lore, tech: newItem.tech }
      : { title: newItem.title, desc: newItem.desc, tech: techArray };
    updateProjectArray(arrayName, [...(contentProject[arrayName] || []), itemToSave]);
    setNewItem({ title: "", desc: "", tech: "", name: "", role: "", lore: "" });
  };

  const handleRemoveItem = (arrayName, idx) => {
    if(window.confirm("Hapus item ini?")) updateProjectArray(arrayName, contentProject[arrayName].filter((_, i) => i !== idx));
  };


  // ==========================================
  // UI RENDER: CHECKING AUTH STATE
  // ==========================================
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-cyan-400">
        <Loader2 size={48} className="animate-spin" />
      </div>
    );
  }

  // ==========================================
  // UI RENDER: LOGIN (PREMIUM VERSION)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-slate-200 px-4">
        <form onSubmit={handleLogin} className="glass-panel p-8 md:p-12 rounded-2xl border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.1)] max-w-md w-full flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-cyan-900/40 rounded-full flex items-center justify-center mb-6 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Lock size={32} className="text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Restricted Access</h2>
          <p className="text-slate-400 text-sm mb-8 font-mono">System Architect Authentication Required</p>
          
          <input 
            type="email" 
            placeholder="Admin Email..." 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 mb-4 focus:outline-none focus:border-cyan-500 transition-all font-mono tracking-wide"
            required autoFocus
          />
          <input 
            type="password" 
            placeholder="Enter Passcode..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 mb-4 focus:outline-none focus:border-cyan-500 transition-all font-mono text-center tracking-widest"
            required
          />
          {errorMsg && <p className="text-red-400 text-xs font-mono mb-4 animate-pulse w-full text-left">{errorMsg}</p>}
          <button type="submit" disabled={isLoggingIn} className="w-full bg-cyan-600/20 border border-cyan-500 text-cyan-400 font-bold py-3 rounded-lg hover:bg-cyan-500 hover:text-slate-900 transition-all shadow-[0_0_15px_rgba(34,211,238,0.15)] disabled:opacity-50">
            {isLoggingIn ? "AUTHENTICATING..." : "INITIALIZE SESSION"}
          </button>
        </form>
      </div>
    );
  }

  // ==========================================
  // UI RENDER: ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="flex min-h-screen bg-[#0c1322] text-slate-200 w-full font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f172a] border-r border-slate-700/50 flex flex-col shadow-2xl shrink-0">
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white"><span className="text-cyan-400">///</span> WS Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => {setActiveMenu("projects"); setContentProject(null);}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeMenu === "projects" ? "bg-cyan-900/30 text-cyan-400 border border-cyan-700/50" : "text-slate-400 hover:bg-slate-800"}`}><LayoutDashboard size={20} /> Architectures</button>
          <button onClick={() => {setActiveMenu("experience"); setContentProject(null);}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeMenu === "experience" ? "bg-cyan-900/30 text-cyan-400 border border-cyan-700/50" : "text-slate-400 hover:bg-slate-800"}`}><Briefcase size={20} /> Core Logs</button>
        </nav>
        <div className="p-4 border-t border-slate-700/50">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 font-medium transition-colors"><LogOut size={20} /> Terminate</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-h-screen relative">
        
        {/* ==========================================
            VIEW 1: PROJECTS TABLE
            ========================================== */}
        {activeMenu === "projects" && !contentProject && (
          <div className="max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">Architectures</h1>
              <button onClick={() => { setModalMode("add"); setFormData(initialFormState); setIsModalOpen(true); }} className="flex items-center gap-2 bg-cyan-600 px-4 py-2.5 rounded-lg text-white hover:bg-cyan-500 font-semibold shadow-lg shadow-cyan-900/20"><Plus size={18} /> Add Project</button>
            </div>
            
            <div className="glass-panel border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-slate-800/80 border-b border-slate-700/50 text-slate-300">
                  <tr><th className="p-4">Project Title</th><th className="p-4 text-center">Structure</th><th className="p-4 text-right">Actions</th></tr>
                </thead>
                <tbody>
                  {isLoading ? <tr><td colSpan="3" className="p-8 text-center text-cyan-400"><Loader2 className="animate-spin mx-auto mb-2"/></td></tr> : 
                   projects.length === 0 ? <tr><td colSpan="3" className="p-8 text-center text-slate-400">No projects found.</td></tr> :
                   projects.map(p => (
                    <tr key={p.id} className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-100">{p.title}</div>
                        <div className="text-xs text-slate-400 font-mono mt-1">ID: {p.id}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-slate-900 px-3 py-1 rounded-full text-xs border border-slate-700 text-cyan-400 font-mono">{p.tabs?.length || 0} Tabs</span>
                      </td>
                      <td className="p-4 flex justify-end gap-3 items-center">
                        <button onClick={() => { 
                                setContentProject(p); 
                                // Otomatis memilih tab pertama saat project dibuka
                                setActiveContentSection(p.tabs?.[0]?.id || ""); 
                                }} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded border border-indigo-500/50 transition-colors text-sm font-semibold"><Layers size={16} /> Content</button>
                        <button onClick={() => { setModalMode("edit"); setFormData(p); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-cyan-400 rounded transition-colors"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteProject(p.id, p.title)} className="p-2 text-slate-400 hover:text-red-400 rounded transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 2: DEEP CONTENT MANAGER
            ========================================== */}
        {activeMenu === "projects" && contentProject && (
          <div className="max-w-5xl mx-auto pb-20 animate-[fadeIn_0.3s_ease-in-out]">
            <button onClick={() => setContentProject(null)} className="flex items-center gap-2 text-cyan-400 mb-6 font-mono hover:text-cyan-300 transition-colors bg-cyan-900/20 px-4 py-2 rounded-lg border border-cyan-800/50 w-max"><ArrowLeft size={18} /> Back to Projects</button>
            
            <div className="mb-8 border-b border-slate-700 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Content Manager</h1>
                <p className="text-slate-400 font-mono text-sm">Target: <span className="text-cyan-400 font-bold">{contentProject.title}</span></p>
              </div>
            </div>

            {/* SEKSI 1: KELOLA TABS */}
            <div className="glass-panel p-6 rounded-xl border border-slate-700 mb-8">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">1. Manage Tabs</h3>
              
              <div className="flex flex-wrap gap-3 mb-6">
                {(contentProject.tabs || []).length === 0 ? <span className="text-slate-500 text-sm italic">Belum ada tab.</span> : 
                  contentProject.tabs.map(tab => (
                  <div key={tab.id} className="bg-slate-800 border border-slate-600 px-3 py-1.5 rounded flex items-center gap-3">
                    <div>
                      <span className="text-sm font-bold text-slate-200 block">{tab.label}</span>
                      <span className="text-xs text-slate-400 font-mono">id: {tab.id}</span>
                    </div>
                    <button onClick={() => handleRemoveTab(tab.id)} className="text-red-400 hover:text-red-300 ml-2"><X size={16}/></button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-3 items-end bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <div className="flex-1 w-full">
                  <label className="text-xs text-slate-400 font-mono mb-1 block">Tab ID (lowercase, no space)</label>
                  <input type="text" value={newTab.id} onChange={e => setNewTab({...newTab, id: e.target.value})} placeholder="e.g. blueprint" className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-cyan-500"/>
                </div>
                <div className="flex-1 w-full">
                  <label className="text-xs text-slate-400 font-mono mb-1 block">Tab Label (Display Name)</label>
                  <input type="text" value={newTab.label} onChange={e => setNewTab({...newTab, label: e.target.value})} placeholder="e.g. [ TECH_BLUEPRINT ]" className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-cyan-500"/>
                </div>
                <button onClick={handleAddTab} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 shrink-0 h-9.5"><PlusCircle size={16}/> Add Tab</button>
              </div>
            </div>

            {/* SEKSI 2: KELOLA KONTEN DALAM TAB */}
            <div className="glass-panel p-6 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-6 border-b border-slate-700/50 pb-4">
                <h3 className="text-xl font-bold text-white">2. Inject Data to Array</h3>
                <select value={activeContentSection} onChange={(e) => setActiveContentSection(e.target.value)} className="bg-slate-800 border border-slate-600 text-white text-sm rounded px-3 py-2 outline-none focus:border-cyan-500 font-mono">
                    {(contentProject.tabs || []).length === 0 ? (
                        <option value="">-- Buat Tab Dulu --</option>
                    ) : (
                        contentProject.tabs.map(tab => (
                        <option key={tab.id} value={tab.id}>Array: {tab.id}</option>
                        ))
                    )}
                </select>
              </div>

              {/* TAMPILAN DATA ARRAY SAAT INI */}
              <div className="mb-6 space-y-3">
                <h4 className="text-sm font-mono text-cyan-400 mb-2">Current Data in '{activeContentSection}':</h4>
                {(contentProject[activeContentSection] || []).length === 0 ? <div className="text-slate-500 text-sm italic bg-slate-900/50 p-4 rounded border border-slate-800">Array kosong.</div> : 
                  contentProject[activeContentSection].map((item, idx) => (
                    <div key={idx} className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg flex justify-between gap-4 group hover:border-cyan-900 transition-colors">
                      <div className="flex-1">
                        <h5 className="font-bold text-slate-200">{activeContentSection === 'agents' ? item.name : item.title}</h5>
                        {activeContentSection === 'agents' && <p className="text-xs text-cyan-400 font-mono mt-1">{item.role}</p>}
                        <p className="text-sm text-slate-400 mt-2 line-clamp-2">{activeContentSection === 'agents' ? item.lore : item.desc}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          {activeContentSection === 'agents' 
                            ? <span className="text-xs bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-700 font-mono">Tech: {item.tech}</span>
                            : item.tech?.map((t, i) => <span key={i} className="text-xs bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-700 font-mono">{t}</span>)
                          }
                        </div>
                      </div>
                      <button onClick={() => handleRemoveItem(activeContentSection, idx)} className="text-red-400 hover:bg-red-400/10 p-2 rounded h-max opacity-50 group-hover:opacity-100 transition-opacity"><Trash2 size={18}/></button>
                    </div>
                ))}
              </div>

              {/* FORM TAMBAH DATA BARU KE ARRAY */}
              <div className="bg-slate-900/80 p-5 rounded-lg border border-slate-700">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><PlusCircle size={16} className="text-cyan-400"/> Push New Item to '{activeContentSection}'</h4>
                
                {activeContentSection === 'agents' ? (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1"><label className="text-xs text-slate-400 font-mono block mb-1">Agent Name</label><input type="text" value={newItem.name} onChange={e=>setNewItem({...newItem, name: e.target.value})} placeholder="e.g. VANGUARD 🛡️" className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-cyan-500"/></div>
                      <div className="flex-1"><label className="text-xs text-slate-400 font-mono block mb-1">Role</label><input type="text" value={newItem.role} onChange={e=>setNewItem({...newItem, role: e.target.value})} placeholder="e.g. Chief Content Officer" className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-cyan-500"/></div>
                    </div>
                    <div><label className="text-xs text-slate-400 font-mono block mb-1">Lore / Bio</label><textarea value={newItem.lore} onChange={e=>setNewItem({...newItem, lore: e.target.value})} rows="2" className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-cyan-500"/></div>
                    <div><label className="text-xs text-slate-400 font-mono block mb-1">Capabilities / Tech (Text)</label><input type="text" value={newItem.tech} onChange={e=>setNewItem({...newItem, tech: e.target.value})} placeholder="e.g. Autonomously drafts campaigns" className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-cyan-500"/></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div><label className="text-xs text-slate-400 font-mono block mb-1">Item Title</label><input type="text" value={newItem.title} onChange={e=>setNewItem({...newItem, title: e.target.value})} placeholder="e.g. Frontend Architecture" className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-cyan-500"/></div>
                    <div><label className="text-xs text-slate-400 font-mono block mb-1">Description</label><textarea value={newItem.desc} onChange={e=>setNewItem({...newItem, desc: e.target.value})} rows="2" className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-cyan-500"/></div>
                    <div><label className="text-xs text-slate-400 font-mono block mb-1">Tech Stack (Pisahkan dengan Koma)</label><input type="text" value={newItem.tech} onChange={e=>setNewItem({...newItem, tech: e.target.value})} placeholder="e.g. Next.js, Tailwind, GSAP" className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-cyan-500 font-mono"/></div>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  <button onClick={() => handleAddItem(activeContentSection)} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-cyan-900/20"><Save size={16}/> Save to Array</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 3: EXPERIENCES (CORE LOGS)
            ========================================== */}
        {activeMenu === "experience" && (
          <div className="max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">Core Logs</h1>
                <p className="text-slate-400 mt-1">Manage your professional experience timeline.</p>
              </div>
              <button onClick={() => { setModalMode("add"); setExpFormData(expInitialState); setIsExpModalOpen(true); }} className="flex items-center gap-2 bg-cyan-600 px-4 py-2.5 rounded-lg text-white hover:bg-cyan-500 shadow-lg shadow-cyan-900/20 font-semibold"><Plus size={18} /> Add Log</button>
            </div>

            <div className="glass-panel border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-slate-800/80 border-b border-slate-700/50 text-slate-300">
                  <tr><th className="p-4 w-16 text-center">ID</th><th className="p-4">Role & Company</th><th className="p-4">Timeline</th><th className="p-4 text-right">Actions</th></tr>
                </thead>
                <tbody>
                  {isLoading ? <tr><td colSpan="4" className="p-8 text-center text-cyan-400"><Loader2 className="animate-spin mx-auto mb-2"/></td></tr> : 
                   experiences.length === 0 ? <tr><td colSpan="4" className="p-8 text-center text-slate-400">No logs found.</td></tr> :
                   experiences.map((exp) => (
                    <tr key={exp.docId} className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 text-center font-mono text-cyan-500 font-bold">{exp.id}</td>
                      <td className="p-4">
                        <p className="font-bold text-slate-100">{exp.role}</p>
                        <p className="text-sm text-slate-400">{exp.company}</p>
                      </td>
                      <td className="p-4"><span className="bg-slate-900 px-3 py-1 rounded-full text-xs font-mono text-slate-300 border border-slate-700">{exp.year}</span></td>
                      <td className="p-4 flex justify-end gap-2">
                        <button onClick={() => { setModalMode("edit"); setExpFormData(exp); setIsExpModalOpen(true); }} className="p-2 text-slate-400 hover:text-cyan-400 rounded transition-colors"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteExperience(exp.docId, exp.role)} className="p-2 text-slate-400 hover:text-red-400 rounded transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ==========================================
          MODAL: PROJECT BASIC INFO
          ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0c1322] border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] my-8">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h3 className="text-2xl font-bold text-white">{modalMode === "add" ? "New Project Target" : "Edit Project Info"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSaveProject} className="space-y-5">
              <div>
                <label className="block text-slate-400 text-xs font-mono mb-1.5">Project ID (Unique, lowercase, no spaces)</label>
                <input type="text" value={formData.id} onChange={(e)=>setFormData({...formData, id: e.target.value.toLowerCase().replace(/\s/g, '')})} disabled={modalMode === "edit"} placeholder="e.g. sqrf" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none font-mono disabled:opacity-50 disabled:cursor-not-allowed transition-colors" required />
              </div>
              <div className="flex flex-col md:flex-row gap-5">
                <div className="flex-1">
                  <label className="block text-slate-400 text-xs font-mono mb-1.5">Display Title</label>
                  <input type="text" value={formData.title} onChange={(e)=>setFormData({...formData, title: e.target.value})} placeholder="e.g. SQRF Intelligence" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors" required />
                </div>
                <div className="flex-1">
                  <label className="block text-slate-400 text-xs font-mono mb-1.5">Subtitle / Tagline</label>
                  <input type="text" value={formData.subtitle} onChange={(e)=>setFormData({...formData, subtitle: e.target.value})} placeholder="e.g. Autonomous AI System" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors" required />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-mono mb-1.5">Main Description</label>
                <textarea value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} rows="3" placeholder="Overview of the project..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none leading-relaxed transition-colors" required />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-mono mb-1.5">Live URL / Demo Link (Optional)</label>
                <input type="url" value={formData.liveUrl} onChange={(e)=>setFormData({...formData, liveUrl: e.target.value})} placeholder="https://..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors" />
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-400 hover:text-white font-medium">Cancel</button>
                <button type="submit" disabled={isSaving} className="bg-cyan-600 px-6 py-2.5 rounded-lg text-white hover:bg-cyan-500 flex items-center gap-2 font-bold shadow-lg shadow-cyan-900/30 transition-all">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: EXPERIENCE (CORE LOGS)
          ========================================== */}
      {isExpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0c1322] border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] my-8">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h3 className="text-2xl font-bold text-white">{modalMode === "add" ? "New Experience Log" : "Edit Log"}</h3>
              <button onClick={() => setIsExpModalOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSaveExperience} className="space-y-5">
              <div className="flex gap-5">
                <div className="w-1/4">
                  <label className="block text-slate-400 text-xs font-mono mb-1.5">Order ID</label>
                  <input type="number" value={expFormData.id} onChange={(e)=>setExpFormData({...expFormData, id: e.target.value})} placeholder="e.g. 1" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none font-mono transition-colors text-center" required />
                </div>
                <div className="w-3/4">
                  <label className="block text-slate-400 text-xs font-mono mb-1.5">Timeline / Year</label>
                  <input type="text" value={expFormData.year} onChange={(e)=>setExpFormData({...expFormData, year: e.target.value})} placeholder="e.g. 2023 - Present" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors" required />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-mono mb-1.5">Job Role</label>
                <input type="text" value={expFormData.role} onChange={(e)=>setExpFormData({...expFormData, role: e.target.value})} placeholder="e.g. Full-Stack Engineer" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors" required />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-mono mb-1.5">Company / Organization</label>
                <input type="text" value={expFormData.company} onChange={(e)=>setExpFormData({...expFormData, company: e.target.value})} placeholder="e.g. PT. Tech Indo" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors" required />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-mono mb-1.5">Description & Achievements</label>
                <textarea value={expFormData.desc} onChange={(e)=>setExpFormData({...expFormData, desc: e.target.value})} rows="5" placeholder="Gunakan bullet (•) untuk poin-poin penting..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none leading-relaxed transition-colors" required />
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
                <button type="button" onClick={() => setIsExpModalOpen(false)} className="px-6 py-2.5 text-slate-400 hover:text-white font-medium">Cancel</button>
                <button type="submit" disabled={isSaving} className="bg-cyan-600 px-6 py-2.5 rounded-lg text-white hover:bg-cyan-500 flex items-center gap-2 font-bold shadow-lg shadow-cyan-900/30 transition-all">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
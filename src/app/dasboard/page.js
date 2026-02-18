"use client";
import { useState, useEffect } from 'react';
import { analisaUlasanAI } from '@/lib/groq';
import { account, databases } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ShieldAlert, Settings, LogOut, Copy, Database, MessageSquare, Info } from 'lucide-react';
import { ID } from 'appwrite';

export default function Dashboard() {
    const [teks, setTeks] = useState('');
    const [hasil, setHasil] = useState(null);
    const [loading, setLoading] = useState(false);
    const [waUser, setWaUser] = useState('');
    const router = useRouter();

    useEffect(() => {
        account.get().then(res => setWaUser(res.email.split('@')[0])).catch(() => router.push('/'));
    }, []);

    const handleLogout = async () => {
        await account.deleteSession('current');
        router.push('/');
    };

    const handleAnalisis = async () => {
        const key = localStorage.getItem('perisai_token');
        if (!key) return router.push('/pengaturan');
        
        setLoading(true);
        try {
            const data = await analisaUlasanAI(key, teks);
            setHasil(data);

            await databases.createDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_COLLECTION_ID,
                ID.unique(),
                {
                    ulasan: teks,
                    sentimen: data.sentimen,
                    isBot: data.deteksi_bot,
                    balasan: data.balasan_saran,
                    waUser: waUser
                }
            );
        } catch (e) { 
            alert("API Key Groq tidak valid atau limit habis. Cek Pengaturan.");
        } finally { 
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
            {/* Navbar Modern */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <ShieldCheck className="text-white" size={20}/>
                        </div>
                        <span className="font-black text-xl tracking-tight text-blue-600">PerisaiReputasi</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:block text-right mr-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Petugas</p>
                            <p className="text-xs font-bold text-slate-700">+{waUser}</p>
                        </div>
                        <button onClick={() => router.push('/pengaturan')} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
                            <Settings size={20}/>
                        </button>
                        <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-full transition-all text-red-500">
                            <LogOut size={20}/>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Kolom Kiri: Input & Instruksi */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                                <MessageSquare size={20}/>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">Input Ulasan Klien</h2>
                                <p className="text-xs text-slate-500">Tempel ulasan dari Google Maps atau Marketplace</p>
                            </div>
                        </div>
                        
                        <textarea 
                            className="w-full h-48 p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-sm font-medium resize-none"
                            placeholder="Contoh: Barangnya bagus tapi pengiriman lama banget..."
                            value={teks}
                            onChange={(e) => setTeks(e.target.value)}
                        />
                        
                        <button 
                            onClick={handleAnalisis} 
                            disabled={loading || !teks} 
                            className={`w-full mt-4 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                                !teks ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95'
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Menganalisis...
                                </span>
                            ) : "Mulai Analisis AI"}
                        </button>
                    </div>

                    {/* Tampilan Hasil (Hanya muncul jika ada hasil) */}
                    {hasil && (
                        <div className="animate-in fade-in zoom-in duration-300 space-y-4">
                            <div className={`p-6 rounded-3xl border-2 flex items-center gap-4 ${hasil.deteksi_bot ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                {hasil.deteksi_bot ? <ShieldAlert className="text-red-500" size={32}/> : <ShieldCheck className="text-emerald-500" size={32}/>}
                                <div>
                                    <h3 className={`font-black text-lg ${hasil.deteksi_bot ? 'text-red-700' : 'text-emerald-700'}`}>
                                        {hasil.deteksi_bot ? "Terdeteksi Bot/Spam!" : "Ulasan Organik (Asli)"}
                                    </h3>
                                    <p className="text-xs font-medium opacity-70">Sentimen: {hasil.sentimen.toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Saran Balasan</span>
                                    <button onClick={() => {navigator.clipboard.writeText(hasil.balasan_saran); alert("Disalin!")}} className="text-slate-400 hover:text-blue-600 transition-colors">
                                        <Copy size={18}/>
                                    </button>
                                </div>
                                <p className="text-slate-700 font-medium leading-relaxed italic">
                                    "{hasil.balasan_saran}"
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Kolom Kanan: Info & Bantuan */}
                <div className="space-y-6">
                    <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-100">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <Info size={18}/> Tips Cepat
                        </h3>
                        <ul className="text-xs space-y-3 opacity-90">
                            <li className="flex gap-2"><span>•</span> Gunakan ulasan minimal 5 kata untuk hasil akurat.</li>
                            <li className="flex gap-2"><span>•</span> AI akan mendeteksi pola bahasa mesin secara otomatis.</li>
                            <li className="flex gap-2"><span>•</span> Klik ikon copy untuk membalas ulasan dengan cepat.</li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Database size={18} className="text-slate-400"/>
                            <h3 className="font-bold text-sm">Status Database</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-[11px] font-bold text-slate-600 uppercase">Terhubung ke Cloud</p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

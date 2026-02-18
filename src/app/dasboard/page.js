"use client";
import { useState, useEffect } from 'react';
import { analisaUlasanAI } from '@/lib/groq';
import { account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ShieldAlert, Settings, LogOut, Copy } from 'lucide-react';

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
        } catch (e) { alert(e.message) }
        finally { setLoading(false) }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-black">
            <div className="bg-white p-5 shadow-sm flex justify-between items-center px-8 border-b sticky top-0 z-50">
                <span className="font-black text-blue-600 italic text-xl tracking-tighter">PerisaiReputasi</span>
                <div className="flex gap-4">
                    <button onClick={() => router.push('/pengaturan')} className="text-gray-400"><Settings size={22}/></button>
                    <button onClick={handleLogout} className="text-red-500"><LogOut size={22}/></button>
                </div>
            </div>

            <div className="max-w-xl mx-auto p-6">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border mb-6">
                    <h2 className="font-bold mb-4">Input Ulasan</h2>
                    <textarea 
                        className="w-full h-40 p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-4 resize-none border-none"
                        placeholder="Tempel ulasan di sini..."
                        value={teks}
                        onChange={(e) => setTeks(e.target.value)}
                    />
                    <button onClick={handleAnalisis} disabled={loading || !teks} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold">
                        {loading ? "Llama 3.3 Sedang Memeriksa..." : "Analisis Sekarang"}
                    </button>
                </div>

                {hasil && (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        <div className={`p-6 rounded-[2rem] flex items-center gap-5 border-2 ${hasil.deteksi_bot ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                            {hasil.deteksi_bot ? <ShieldAlert className="text-red-500" size={40}/> : <ShieldCheck className="text-green-500" size={40}/>}
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Status Keamanan</p>
                                <p className={`text-xl font-black ${hasil.deteksi_bot ? 'text-red-600' : 'text-green-600'}`}>{hasil.deteksi_bot ? "BOT / SPAM" : "AMAN"}</p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[10px] font-bold text-slate-300 uppercase italic">Balasan AI (Llama 3.3 70B)</p>
                                <button onClick={() => {navigator.clipboard.writeText(hasil.balasan_saran); alert("Disalin!")}} className="text-blue-500"><Copy size={16}/></button>
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed italic">"{hasil.balasan_saran}"</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
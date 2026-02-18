"use client";
import { useEffect, useState } from 'react';
import { account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import ApiKeyInput from '@/components/ApiKeyInput';

export default function Pengaturan() {
    const [apiKey, setApiKey] = useState('');
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        account.get().then(res => {
            setUser(res);
            setApiKey(localStorage.getItem('perisai_token') || '');
        }).catch(() => router.push('/'));
    }, []);

    const simpan = () => {
        if (!apiKey.startsWith('gsk_')) return alert("Gunakan Token Groq (gsk_...)");
        localStorage.setItem('perisai_token', apiKey);
        router.push('/dashboard');
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center font-bold">Memuat...</div>;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-black">
            <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                <p className="text-blue-600 font-bold text-[10px] uppercase mb-1">USER ID: {user.email.split('@')[0]}</p>
                <h2 className="text-2xl font-black mb-6 italic">Aktivasi AI</h2>
                <ApiKeyInput value={apiKey} onChange={setApiKey} />
                <button onClick={simpan} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold mt-6 hover:bg-blue-700 transition-all">
                    Aktifkan Dashboard
                </button>
            </div>
        </div>
    );
}
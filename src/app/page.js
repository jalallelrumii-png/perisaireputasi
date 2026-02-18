"use client";
import { useState } from 'react';
import { account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [nomorWA, setNomorWA] = useState('');
    const [password, setPassword] = useState('');
    const [isDaftar, setIsDaftar] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        const emailFormat = `${nomorWA.replace('+', '')}@perisai.com`;

        try {
            if (isDaftar) {
                await account.create('unique()', emailFormat, password);
                alert("Nomor WA " + nomorWA + " Berhasil Didaftar!");
                setIsDaftar(false);
            } else {
                await account.createEmailPasswordSession(emailFormat, password);
                router.push('/pengaturan');
            }
        } catch (error) {
            alert("Gagal: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6 text-black">
            <div className="w-full max-w-sm">
                <h1 className="text-4xl font-black text-blue-600 italic mb-2 tracking-tighter text-center">PerisaiReputasi</h1>
                <p className="text-gray-400 mb-8 font-medium text-center italic">WhatsApp Login (No OTP)</p>

                <form onSubmit={handleAuth} className="space-y-4">
                    <input 
                        type="tel" placeholder="Nomor WA (Contoh: 62812...)" 
                        className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                        onChange={(e) => setNomorWA(e.target.value)}
                        required
                    />
                    <input 
                        type="password" placeholder="Password" 
                        className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all">
                        {loading ? "Menghubungkan..." : isDaftar ? "Daftar Nomor WA" : "Masuk Sekarang"}
                    </button>
                </form>

                <button onClick={() => setIsDaftar(!isDaftar)} className="w-full text-center text-sm text-gray-400 mt-6 underline">
                    {isDaftar ? "Sudah punya akun? Login" : "Belum punya akun? Daftar Baru"}
                </button>
            </div>
        </div>
    );
}
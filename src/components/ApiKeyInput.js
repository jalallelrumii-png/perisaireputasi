"use client";
import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function ApiKeyInput({ value, onChange }) {
    const [tampil, setTampil] = useState(false);
    return (
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
            </div>
            <input
                type={tampil ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="gsk_..."
                className="block w-full pl-12 pr-12 py-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-black bg-gray-50 font-mono text-xs"
            />
            <button onClick={() => setTampil(!tampil)} className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                {tampil ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
}
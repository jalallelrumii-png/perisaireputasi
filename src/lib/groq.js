import Groq from "groq-sdk";

export const analisaUlasanAI = async (apiKey, teks) => {
    const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
    
    const prompt = `
        Tugas: Analisis ulasan e-commerce berikut dalam Bahasa Indonesia.
        Ulasan: "${teks}"
        
        WAJIB Berikan jawaban dalam format JSON murni:
        {
            "sentimen": "Positif/Negatif/Netral",
            "deteksi_bot": true/false,
            "balasan_saran": "Tulis balasan yang sangat manusiawi, sopan, dan solutif"
        }
    `;

    try {
        const response = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        throw new Error("Token AI tidak valid atau kuota habis.");
    }
};
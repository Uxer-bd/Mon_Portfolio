export default async function handler(req, res) {
    // 1. Sécurité : On n'accepte que les requêtes POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const { prompt, systemPrompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY; // On récupère la clé depuis Vercel

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json({ 
                reply: data.candidates[0].content.parts[0].text 
            });
        } else {
            return res.status(500).json({ error: 'Erreur de réponse de l\'IA' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Erreur réseau serveur' });
    }
}
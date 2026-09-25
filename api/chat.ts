import { GoogleGenAI } from '@google/genai';
import { SVS_PROJECTS_SUMMARY, semanticSearchContext } from '../src/data/svsSystemContext';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, isLoggedIn, userRole, history } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid prompt message is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const systemInstruction = `
You are SVS AI Concierge, the official, intelligent virtual assistant for SVS Srivasudha Real Estate & Infrastructure (20+ years legacy, est. 2004).

STRICT INSTRUCTIONS:
- Directly and accurately answer ANY question context-wise with facts.
- Do NOT output action button syntax, buttons, or custom UI code.
- Provide clean, polite, structured conversational text using clear markdown bolding and bullet points.
- SVS Helpline: +91 86888 81283 | Email: info@svssrivasudha.com | Office: Jubilee Hills, Hyderabad.

${SVS_PROJECTS_SUMMARY}
`;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
      if (Array.isArray(history)) {
        for (const item of history) {
          if (item && item.text && (item.role === 'user' || item.role === 'model')) {
            contents.push({
              role: item.role,
              parts: [{ text: String(item.text) }],
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const candidateModels = ['gemini-3.7-flash', 'gemini-flash-latest'];

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.25,
            },
          });

          if (response.text && response.text.trim()) {
            return res.status(200).json({ text: response.text.trim() });
          }
        } catch (modelErr: any) {
          const isDemandSpike = modelErr?.status === 'UNAVAILABLE' || modelErr?.code === 503 || String(modelErr?.message || '').includes('demand');
          if (isDemandSpike) {
            console.warn(`[AI Engine] ${model} high demand (503), trying next model...`);
            continue;
          }
          console.warn(`[AI Engine] ${model} error:`, modelErr?.message || modelErr);
        }
      }
    }

    const fallbackText = semanticSearchContext(message, isLoggedIn);
    return res.status(200).json({ text: fallbackText });
  } catch (err) {
    console.error('Vercel Function Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

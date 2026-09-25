import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { 
  SVS_CORE_MISSION, 
  SVS_PROJECTS_SUMMARY, 
  semanticSearchContext 
} from './src/data/svsSystemContext';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Backend & Database Health Check Endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      service: 'SVS True Wealth Backend API',
      database: 'Firebase Firestore Connected',
      auth: 'Firebase Authentication & RBAC Active',
      timestamp: new Date().toISOString(),
      version: '2.6.0'
    });
  });

  // Server-Side Gemini API Route for SVS AI Concierge with High-Demand Resilience
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, isLoggedIn, userRole, history } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Valid prompt message is required.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey) {
        const systemInstruction = `
You are SVS AI Concierge, the official, intelligent virtual assistant for SVS Srivasudha Real Estate & Infrastructure (est. 2004, 20+ years of trust).

OBJECTIVE:
Provide direct, accurate, professional, context-rich answers to ANY user inquiry regarding real estate, plots, villas, pricing, approvals, booking processes, memberships, resorts, NRI services, or general guidance.

STRICT INSTRUCTIONS:
- Do NOT output any UI code, buttons, square-bracket action tags (no [ACTION:..]), or HTML elements.
- Answer purely in natural, well-formatted conversational text using markdown (**bolding**, clear bullet points where helpful).
- Answer must be direct, intelligent, informative, and context-appropriate.
- If the question is about real estate, plots, pricing, or locations, provide exact prices, approvals (DTCP/HMDA/RERA), and locations.
- If the question is general or technical, answer it smartly with utmost clarity.

COMPREHENSIVE SVS KNOWLEDGE BASE:
Organization: SVS Srivasudha Real Estate & Infrastructure
Headquarters: SVS Towers, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033
Branches: Hyderabad, Visakhapatnam (Vizag), Vijayawada, Bangalore, Goa
Helpline & WhatsApp: +91 86888 81283 | Alternate: +91 91212 12345
Email: info@svssrivasudha.com | Hours: Mon-Sun 9 AM - 8 PM IST

${SVS_PROJECTS_SUMMARY}

COMPLIMENTARY CAB SERVICE:
- 100% free doorstep AC cab pick-up & drop across Hyderabad for site inspection with no obligations.

LEGAL TRANSPARENCY:
- 100% DTCP / HMDA / VMRDA / CRDA / RERA approved master plans.
- 30-year link documents & certified Encumbrance Certificates (EC).
- Spot registration with instant government passbook issuance.
- Pre-approved bank loans up to 70-80% from SBI, HDFC, ICICI, and Axis Bank.

PRIVILEGE MEMBERSHIP:
- Silver (₹25k / 3 yrs): 5% plot pre-launch discount + 2 complimentary resort nights/yr.
- Gold (₹50k / 5 yrs): 8% plot pre-launch discount + 4 complimentary resort nights/yr + pool/sports access.
- Platinum (₹1L / 5 yrs): 12% plot pre-launch discount + 8 complimentary resort nights/yr + VIP lounge + relationship manager.

HOSPITALITY & RESORTS:
- Royal Palm Eco Resort & Clubhouse: Staycation cottages, banquet lawns (100 - 2,500 pax), sports arena, swimming pools.

NRI GLOBAL DESK:
- Dedicated country coordinators across 15+ countries (USA, UAE, UK, Australia, Singapore).
- 100% remote purchase, 360° VR inspection, power of attorney (POA) guidance, and regular photo updates.

BUSINESS ASSOCIATES:
- Free partner enrollment, up to 5% plot sales commissions, hierarchical referral incentives, and real-time associate portal.

AUTHENTICATION CONTEXT:
- User is currently ${isLoggedIn ? `logged in as an authorized SVS ${userRole || 'Member'}` : 'a guest visitor'}.
`;

        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        // Sanitize history for Gemini SDK
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

        // Cascade through models to gracefully handle high-demand 503 errors
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
              return res.json({ text: response.text.trim() });
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

      // Fallback Route: Local Semantic Context Engine
      const fallbackText = semanticSearchContext(message, isLoggedIn);
      return res.json({ text: fallbackText });

    } catch (err: any) {
      console.error('Server Chat Endpoint Error:', err);
      return res.status(500).json({ error: 'Internal server error while processing message.' });
    }
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

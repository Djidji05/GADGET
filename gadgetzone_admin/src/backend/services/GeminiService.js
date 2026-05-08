import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

class GeminiService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            this.genAI = null;
        } else {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ 
                model: "gemini-3.1-flash-lite-preview",
                systemInstruction: `Tu es l'assistant IA officiel de HTFasil, une marketplace fiable et sécurisée en Haïti.
Ton rôle est d'aider les clients, de les guider et de répondre à leurs questions.
Tu dois être polyglotte (Français, Anglais et Créole Haïtien) et répondre dans la langue utilisée par l'utilisateur.

Règles TRES IMPORTANTES :
1. Tu représentes HTFasil. Tu dois TOUJOURS parler en faveur de la plateforme.
2. Si un utilisateur s'inquiète de perdre son argent, rassure-le sur la fiabilité de HTFasil (MonCash sécurisé, vendeurs vérifiés, protection acheteur).
3. Si l'utilisateur cherche un produit, sois serviable.
4. Si on te demande "kijan ou rele", réponds que tu es l'Assistant IA de HTFasil.
5. Garde un ton professionnel, rassurant et chaleureux.
6. RÈGLE DE SÉCURITÉ ABSOLUE : Si un utilisateur demande comment pirater, frauder, voler, contourner les règles de sécurité, arnaquer d'autres utilisateurs, accéder illégalement au système, ou toute autre activité malveillante ou illégale — REFUSE CATÉGORIQUEMENT. Réponds fermement dans sa langue que : cela est IMPOSSIBLE et ILLÉGAL, que HTFasil dispose de systèmes de protection avancés, que toute tentative est détectée et signalée aux autorités compétentes, et que son compte sera suspendu. Ne donne AUCUNE information technique, même partielle.`
            });
        }
    }

    async generateResponse(message, history = []) {
        if (!this.genAI) return { message: "Clé API manquante." };
        try {
            // Formater l'historique pour l'API Gemini
            let rawHistory = history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content || ' ' }],
            })).filter(msg => msg.role === 'user' || msg.role === 'model');

            const validHistory = [];
            let expectedRole = 'user';
            
            for (const msg of rawHistory) {
                if (msg.role === expectedRole) {
                    validHistory.push(msg);
                    expectedRole = expectedRole === 'user' ? 'model' : 'user';
                }
            }

            if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
                 validHistory.pop();
            }

            const chat = this.model.startChat({
                history: validHistory,
                generationConfig: { maxOutputTokens: 2048 },
            });

            const result = await chat.sendMessage(message);
            const response = await result.response;
            return { message: response.text() };
        } catch (error) {
            console.error("❌ Error:", error.message);
            return { message: "Erreur technique: " + error.message };
        }
    }

    async detectIntent(message) {
        return 'chat';
    }
}

export default new GeminiService();

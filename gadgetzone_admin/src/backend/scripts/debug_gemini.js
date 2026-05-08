import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key found");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // List models is not directly exposed on genAI in all versions, 
        // we might need to use a fetch or a different method.
        // But we can try to initialize the model and see.
        
        console.log("Testing accessibility of gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("test");
        console.log("Success!");
    } catch (error) {
        console.error("Error code:", error.status);
        console.error("Error message:", error.message);
    }
}

listModels();

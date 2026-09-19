import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const systemInstruction = `You are an AI App Architect. Analyze the user's idea and generate a structured JSON breakdown.
Return ONLY a raw JSON object with this exact key structure:
{
  "appName": "Name of app",
  "tagline": "Short pitch",
  "features": ["feature 1", "feature 2", "feature 3"],
  "techStack": ["tech 1", "tech 2"],
  "starterCode": "// Fully functional python code here"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [systemInstruction, `App Idea: ${prompt}`],
      config: {
        responseMimeType: "application/json",
      }
    });

    const data = JSON.parse(response.text);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

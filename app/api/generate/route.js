import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is missing in Vercel Environment Variables.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are an AI App Architect. Analyze the user's idea and generate a structured JSON breakdown.
Return ONLY a raw JSON object with this exact key structure:
{
  "appName": "Name of app",
  "tagline": "Short pitch",
  "features": ["feature 1", "feature 2", "feature 3"],
  "techStack": ["tech 1", "tech 2"],
  "starterCode": "# Fully functional python code here"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${systemInstruction}\n\nApp Idea: ${prompt}`,
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

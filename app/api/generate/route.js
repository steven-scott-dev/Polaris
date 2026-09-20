import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is missing. Add GEMINI_API_KEY in Vercel settings.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are an AI App Architect. Analyze the user's idea and generate a structured JSON breakdown.
Return ONLY raw JSON with these keys: appName (string), tagline (string), features (array of strings), techStack (array of strings), starterCode (string).`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `${systemInstruction}\n\nApp Idea: ${prompt}`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const data = JSON.parse(response.text);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key missing. Add GEMINI_API_KEY in Vercel settings.' },
        { status: 500 }
      );
    }

    const systemInstruction = `You are an AI App Architect. Analyze the user's idea and generate a structured JSON breakdown.
Return ONLY raw JSON with these keys: appName (string), tagline (string), features (array of strings), techStack (array of strings), starterCode (string).`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemInstruction}\n\nApp Idea: ${prompt}` }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    const result = await apiResponse.json();

    if (!apiResponse.ok) {
      throw new Error(result.error?.message || 'Gemini API failed');
    }

    const rawText = result.candidates[0].content.parts[0].text;
    const data = JSON.parse(rawText);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

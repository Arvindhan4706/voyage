import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { itinerary, prompt } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing GROQ API Key" }, { status: 500 });
    }

    const systemPrompt = `You are an expert luxury travel planner AI. 
The user is providing you with their current itinerary JSON and a prompt to modify it.
You must return the EXACT SAME JSON structure, but with the days modified according to the user's prompt.
DO NOT return any conversational text. DO NOT use markdown code blocks like \`\`\`json. Return ONLY the raw JSON object.
Keep the existing destination, budget, coordinates, and weather as they are. Just modify the 'days' array.`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `CURRENT ITINERARY:\n${JSON.stringify(itinerary)}\n\nUSER PROMPT: ${prompt}` }
        ],
        temperature: 0.5,
      })
    });

    const data = await res.json();
    const content = data.choices[0].message.content.trim();
    
    // Clean potential markdown from LLaMA
    const cleanContent = content.replace(/^```json/i, "").replace(/```$/, "").trim();

    return NextResponse.json(JSON.parse(cleanContent));
  } catch (error) {
    console.error("Trip Chat Error:", error);
    return NextResponse.json({ error: "Failed to update itinerary" }, { status: 500 });
  }
}

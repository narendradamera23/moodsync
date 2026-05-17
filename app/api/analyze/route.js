import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { situation } = await request.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `You are a deep emotion reader and music expert.
The user describes their current situation or feeling:
"${situation}"

Analyze this deeply and respond ONLY with a valid JSON object, no extra text, no markdown, no backticks:
{
  "primaryEmotion": "the main emotion in one word",
  "subEmotions": ["emotion1", "emotion2", "emotion3"],
  "energyLevel": 5,
  "timeOfDayFeel": "late night",
  "musicNeeds": "what kind of music would perfectly fit this moment",
  "searchQuery": "specific search query to find the perfect song on itunes",
  "reason": "one sentence on why this type of music fits their situation",
  "colorMood": "#1a1a2e"
}`,
        },
      ],
    });

    const text = completion.choices[0].message.content;
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const emotion = JSON.parse(clean);
    return Response.json(emotion);
  } catch (err) {
    console.error("FULL ERROR:", err.message);
    return Response.json({
      primaryEmotion: "Reflective",
      subEmotions: ["calm", "thoughtful", "curious"],
      energyLevel: 4,
      timeOfDayFeel: "evening",
      musicNeeds: "ambient instrumental music",
      searchQuery: "ambient chill lofi music",
      reason: "Soft instrumental music suits a reflective mood perfectly.",
      colorMood: "#1a1a2e",
    });
  }
}
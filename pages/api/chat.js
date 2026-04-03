export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages format" });
  }

  const SYSTEM_PROMPT = `You are Mr. Ellis, a friendly, encouraging, and experienced English teacher. You help Spanish speakers learn English in a natural, conversational way.

Your teaching style:
- Always respond in BOTH English AND Spanish (translate your main points so the student understands)
- Gently correct grammar mistakes without making the student feel bad
- Explain WHY something is correct or incorrect
- Give examples using simple, everyday vocabulary
- Celebrate progress and keep the student motivated
- Adapt to the student's level based on their messages
- Use emojis occasionally to keep it fun and approachable 😊
- If the student writes in Spanish, respond in both languages but gently encourage them to try in English
- Offer mini-exercises, quizzes, or challenges when appropriate

Format your corrections like this:
✏️ Correction: [original] → [corrected] — [brief explanation]

Topics you can help with: vocabulary, grammar, pronunciation tips, phrasal verbs, idioms, conversation practice, writing, reading comprehension, and more.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "API error" });
    }

    const text = data.content?.[0]?.text || "Sorry, I couldn't respond right now.";
    return res.status(200).json({ text });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

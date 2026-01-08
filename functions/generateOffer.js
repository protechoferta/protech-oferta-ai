// api/generateOffer.js
const OpenAI = require("openai");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Użyj POST." });
  }

  try {
    const { prompt } = req.body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    res.status(200).json({ text: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const OpenAI = require("openai");

exports.handler = async function(event, context) {
  try {
    const { prompt } = JSON.parse(event.body);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY  // <--- tutaj pobieramy klucz z Netlify
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ text: completion.choices[0].message.content })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

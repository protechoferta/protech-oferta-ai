// functions/generateOffer.js
const OpenAI = require("openai");

exports.handler = async function(event, context) {
  try {
    // Sprawdzenie, czy metoda POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Allow": "POST" },
        body: JSON.stringify({ error: "Method Not Allowed. Użyj POST." })
      };
    }

    // Pobranie promptu z body
    const { prompt } = JSON.parse(event.body);

    // Inicjalizacja klienta OpenAI z kluczem w zmiennej środowiskowej Netlify
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Wywołanie modelu GPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    // Zwrócenie wyniku do frontendu
    return {
      statusCode: 200,
      body: JSON.stringify({ text: completion.choices[0].message.content })
    };

  } catch (error) {
    // Obsługa błędów
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

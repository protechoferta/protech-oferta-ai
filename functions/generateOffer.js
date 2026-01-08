export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    const data = JSON.parse(event.body || "{}");

    if (!data.prompt) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Brak promptu" }),
      };
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Brak klucza OPENAI_API_KEY" }),
      };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Jesteś asystentem do generowania ofert." },
          { role: "user", content: data.prompt },
        ],
      }),
    });

    const result = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: result.choices?.[0]?.message?.content || "Brak odpowiedzi AI",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Błąd serwera",
        details: error.message,
      }),
    };
  }
}

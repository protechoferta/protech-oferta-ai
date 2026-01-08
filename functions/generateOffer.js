exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body || "{}");

    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Brak OPENAI_API_KEY w Netlify" })
      };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Jesteś ekspertem od ofert handlowych." },
          { role: "user", content:
`Branża: ${data.industry}
Zakres: ${data.scope}
Cena: ${data.price}
Termin: ${data.deadline}
Firma: ${data.company}

Napisz profesjonalną ofertę handlową.` }
        ]
      })
    });

    const text = await response.text();
    const json = JSON.parse(text);

    return {
      statusCode: 200,
      body: JSON.stringify({
        text: json.choices[0].message.content
      })
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};

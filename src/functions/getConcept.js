const { app } = require("@azure/functions");
const OpenAI = require("openai");
const tableClient = require("../../shared/tableClient");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.http("getConcept", {
  methods: ["GET"],
  authLevel: "function",
  route: "concepts/{concept}",
  handler: async (request, context) => {
    const concept = request.params.concept;

    try {
      const entity = await tableClient.getEntity("concept", concept);
      return {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concept,
          professional: entity.professional,
          plain: entity.plain,
          cached: true
        })
      };
    } catch (err) {
      if (err.statusCode !== 404) throw err;
    }

    const [professionalRes, plainRes] = await Promise.all([
      openai.chat.completions.create({
        model: "gpt-5-nano",
        messages: [
          {
            role: "system",
            content:
              "You are a technical expert. Explain the following term professionally and concisely in 2-3 sentences."
          },
          { role: "user", content: concept }
        ]
      }),
      openai.chat.completions.create({
        model: "gpt-5-nano",
        messages: [
          {
            role: "system",
            content:
              "Explain the following term in plain, simple language that anyone can understand. Use 2-3 sentences."
          },
          { role: "user", content: concept }
        ]
      })
    ]);

    const professional = professionalRes.choices[0].message.content;
    const plain = plainRes.choices[0].message.content;

    await tableClient.upsertEntity({
      partitionKey: "concept",
      rowKey: concept,
      professional,
      plain
    });

    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concept, professional, plain, cached: false })
    };
  }
});

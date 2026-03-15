const { app } = require("@azure/functions");
const client = require("../../shared/tableClient");

app.http("getConcepts", {
  methods: ["GET"],
  authLevel: "function",
  route: "concepts",
  handler: async (request, context) => {
    const entities = client.listEntities();
    const concepts = [];
    for await (const entity of entities) {
      concepts.push(entity.rowKey);
    }
    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(concepts)
    };
  }
});

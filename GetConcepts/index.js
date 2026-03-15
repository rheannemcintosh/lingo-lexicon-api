const client = require("../shared/tableClient");

module.exports = async function (context, req) {
  const entities = client.listEntities();
  const concepts = [];
  for await (const entity of entities) {
    concepts.push(entity.rowKey);
  }
  context.res = {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(concepts)
  };
};

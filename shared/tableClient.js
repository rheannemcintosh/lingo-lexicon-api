const { TableClient } = require('@azure/data-tables');

const client = TableClient.fromConnectionString(
    process.env.STORAGE_CONNECTION_STRING,
    'concepts'
);

module.exports = client;

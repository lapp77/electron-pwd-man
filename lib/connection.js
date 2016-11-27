const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
    host: process.env.DB_CONN_URL
});

module.exports = client;
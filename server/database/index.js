const cassandra = require('cassandra-driver');

const keyspace = process.env.KEYSPACE || 'eventstore';
const contactPoints = process.env.CONTACTPOINTS ? process.env.CONTACTPOINTS.split(',') : ['127.0.0.1'];
const client = new cassandra.Client({ contactPoints, keyspace });

module.exports = { client };

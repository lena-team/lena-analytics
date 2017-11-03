const cassandra = require('cassandra-driver');
const pg = require('pg');
const elasticsearch = require('elasticsearch');

// for cassandra
const keyspace = process.env.KEYSPACE || 'eventstore';
const contactPoints = process.env.CONTACTPOINTS ? process.env.CONTACTPOINTS.split(',') : ['127.0.0.1'];
const client = new cassandra.Client({ contactPoints, keyspace });

// for psql
const pgClient = new pg.Client({
  user: process.env.POSTGRESUSER || 'postgres',
  host: process.env.POSTGRESHOST || '127.0.0.1',
  database: process.env.POSTGRESDB || 'eventtypedb',
  password: process.env.POSTGRESPASS || 'nyancat',
  port: process.env.POSTGRESPORT || '5432',
});

// for elasticsearch
const elasticClient = new elasticsearch.Client({
  host: 'elastic:changeme@localhost:9200',
});

pgClient.connect();

module.exports = { client, pgClient, elasticClient };

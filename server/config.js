const AWS = require('aws-sdk');

// load api keys
AWS.config.loadFromPath('./config.json');

// create sqs
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

module.exports = { sqs };

const cassandra = require('cassandra-driver');
const uuid = require('node-uuid');

const keyspace = process.env.KEYSPACE || 'eventstore';

let contactPoints;
if (process.env.CONTACTPOINTS) {
  contactPoints = process.env.CONTACTPOINTS.split(',');
} else {
  contactPoints = ['104.237.154.8'];
}

const client = new cassandra.Client({ contactPoints, keyspace });

const insertEvent = (eventType = null, eventDates = null, eventTexts = null, eventInts = null) => {
  const query = 'INSERT INTO events (id, eventcreatedat, eventtype, eventdatetype, eventtexttype, eventinttype) VALUES (?, ?, ?, ?, ?, ?)';
  const params = [
    uuid.v4(),
    new Date().toISOString(),
    eventType,
    eventDates,
    eventTexts,
    eventInts,
  ];
  return client.execute(query, params, { prepare: true });
};

const findEvent = (eventType, fromEventTime) => {
  const query = 'SELECT * FROM events WHERE eventtype = ? AND eventcreatedat > ?';
  const params = [eventType, fromEventTime];
  return client.execute(query, params, { prepare: true });
};

module.exports = {
  insertEvent,
  findEvent,
};


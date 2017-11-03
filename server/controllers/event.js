const uuid = require('node-uuid');
const { client } = require('../database');

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

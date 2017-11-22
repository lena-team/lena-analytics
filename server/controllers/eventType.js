const { pgClient } = require('../database');

const insertEventType = (eventName) => {
  const query = 'INSERT INTO eventtype(eventname) VALUES($1)';
  const values = [eventName];
  return pgClient.query(query, values);
};

const getEventTypes = () => {
  const query = 'SELECT * FROM eventtype';
  return pgClient.query(query);
};

const updateEventType = (eventName, endTime) => {
  const query = 'UPDATE eventtype SET endtime = $1 WHERE eventname = $2';
  const values = [endTime, eventName];
  return pgClient.query(query, values);
};

module.exports = { insertEventType, getEventTypes, updateEventType };

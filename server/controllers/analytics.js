const event = require('./event');
const eventType = require('./eventType');
const { elasticClient } = require('../database');

// get list of eventtypes from postgres, and use the result to generate array with eventdata
const getEventsFromEventType = eventsArray => eventType.getEventTypes()
  .then((eventTypes) => {
    const eventsData = [];
    eventTypes.rows.forEach((type) => {
      if (type.endtime) {
        eventsArray.push(type.eventname);
        eventsData.push(event.findEvent(type.eventname, type.endtime));
      }
    });
    return Promise.all(eventsData);
  });

// use eventData and update elastic database with bulk insertion
const updateElasticDb = (eventsData) => {
  const elasticData = [];
  eventsData.forEach((eventData) => {
    if (eventData.rows.length > 0) {
      for (let i = 0; i < eventData.rows.length; i += 1) {
        elasticData.push({
          index: {
            _index: 'event',
            _type: eventData.rows[i].eventtype,
          },
        });
        elasticData.push(eventData.rows[i]);
      }
    }
  });
  if (elasticData.length > 0) {
    return elasticClient.bulk({
      body: elasticData,
    });
  }
  throw new Error('no new data');
};

// use eventsData and events list to update the time on
const updateEventTypeTime = (eventsArray, eventsData) => {
  const eventPromise = eventsArray.map((eventName, index) => eventType.updateEventType(
    eventName,
    eventsData[index].rows[eventsData[index].rows.length - 1].eventcreatedat,
  ));
  return Promise.all(eventPromise);
};

const updateElastic = () => {
  const events = [];
  let eventsDataArray;
  let elasticResults;

  return getEventsFromEventType(events)
    .then((eventsData) => {
      eventsDataArray = eventsData;
      return updateElasticDb(eventsData);
    })
    .then((elasticResult) => {
      elasticResults = elasticResult;
      return updateEventTypeTime(events, eventsDataArray);
    })
    .then(() => elasticResults)
    .catch((err) => {
      throw new Error(err);
    });
};

module.exports = { updateElastic };

// setInterval(() => {
// updateElasticRefactored();
// }, 5000);

const event = require('./event');
const eventType = require('./eventType');
const { elasticClient } = require('../database');

const updateElastic = () => {
  const events = [];
  let finalResults = [];
  let elasticResults;
  return eventType.getEventTypes()
    .then((results) => {
      const eventPromise = [];
      results.rows.forEach((eventT) => {
        if (eventT.endtime) {
          events.push(eventT.eventname);
          eventPromise.push(event.findEvent(eventT.eventname, eventT.endtime));
        }
      });
      return Promise.all(eventPromise);
    })
    .then((results) => {
      finalResults = results;
      const elasticData = [];
      results.forEach((eventData) => {
        for (let i = 0; i < eventData.rows.length; i += 1) {
          elasticData.push({
            index: {
              _index: 'event',
              _type: eventData.rows[i].eventtype,
            },
          });
          elasticData.push(eventData.rows[i]);
        }
      });
      return elasticClient.bulk({
        body: elasticData,
      });
    })
    .then((results) => {
      elasticResults = results;
      const eventPromise1 = [];
      events.forEach((eventTT, index) => {
        eventPromise1.push(eventType.updateEventType(
          eventTT,
          finalResults[index].rows[finalResults[index].rows.length - 1].eventcreatedat,
        ));
      });
      return Promise.all(eventPromise1);
    })
    .then(() => elasticResults);
};

module.exports = { updateElastic };

setInterval(() => {
  updateElastic();
}, 7000);

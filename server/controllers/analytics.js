const event = require('./event');
const eventType = require('./eventType');

const updateElastic = () => {
  const events = [];
  let finalResults = [];
  let elasticData = '';
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
      results.forEach((eventData) => {
        console.log(eventData.rows.length);
        for (let i = 0; i < eventData.rows.length; i += 1) {
          elasticData += JSON.Stringify({
            index: {
              _index: 'event',
              _type: 'act',
              _id: 0,
            },
          });
          elasticData += '\n';
          elasticData += JSON.Stringify(eventData.rows[i]);
          elasticData += '\n';
        }
      });
      console.log(elasticData);
    })
    .then(() => {
      const eventPromise1 = [];
      events.forEach((eventTT, index) => {
        eventPromise1.push(eventType.updateEventType(
          eventTT,
          finalResults[index].rows[finalResults[index].rows.length - 1].eventcreatedat,
        ));
      });
      return Promise.all(eventPromise1);
    })
    .then(() => {
      console.log(elasticData);
      return elasticData;
    });
};

module.exports = { updateElastic };


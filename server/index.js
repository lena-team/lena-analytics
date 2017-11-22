const express = require('express');
const controller = require('./controllers');
const { sqs } = require('./config');

const app = express();
const port = process.env.PORT || 1337;

app.get('/events', (req, res) => {
  controller.event.findEvent(req.query.eventType, req.query.fromEventTime)
    .then((results) => {
      res.send(results.rows);
    })
    .catch(err => res.send(err));
});

app.get('/analytics', (req, res) => {
  controller.analytics.updateElastic()
    .then(results => res.sendStatus(200))
    .catch(err => res.send(err));
});

app.get('/eventtype', (req, res) => {
  controller.eventType.getEventTypes()
    .then(results => res.send(results.rows));
});

app.post('/eventtype', (req, res) => {
  controller.eventT4ype.insertEventType(req.query.eventName)
    .then(results => res.send(results));
});

app.listen(port, () => {
  console.log(`(>^.^)> now listening on port ${port}!`);
});

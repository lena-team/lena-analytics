const express = require('express');
const controller = require('./controllers');

const app = express();
const port = process.env.PORT || 1337;

app.get('/events', (req, res) => {
  controller.event.findEvent(req.query.eventType, req.query.eventTime)
    .then(results => res.send(results.rows))
    .catch(err => res.send(err));
});

app.listen(port, () => {
  console.log(`(>^.^)> now listening on port ${port}!`);
});

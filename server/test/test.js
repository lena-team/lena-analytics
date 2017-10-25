/* eslint-env mocha */
const { assert } = require('chai');
const controller = require('../controllers');
const { client } = require('../database');

describe('Event API Tests', () => {
  beforeEach((done) => {
    client.execute('DROP TABLE IF EXISTS eventstore.events')
      .then(() => client.execute('CREATE TABLE eventstore.events (id UUID, eventCreatedAt TIMESTAMP, eventType TEXT, eventDateType map <TEXT, TIMESTAMP>, eventTextType map<TEXT, TEXT>, eventIntType map<TEXT, INT>, PRIMARY KEY (eventType, eventCreatedAt, id))'))
      .then(() => done());
  });

  describe('insertEvent', () => {
    it('should insert an event successfully', () => {
      const eventDateType = {
        testfield1: new Date().toISOString(),
        testfield2: new Date().toISOString(),
        testfield3: new Date().toISOString(),
      };

      const eventTextType = {
        harry: 'potter',
        ron: 'weasley',
        leo: 'leung',
      };

      return controller.event.insertEvent('Wingardium Leviosa', eventDateType, eventTextType)
        .then((results) => {
          assert(results.info.warnings === undefined);
        });
    });
  });

  describe('findEvent', () => {
    it('should get events successfully', () => {
      const eventDateType = {
        testfield1: new Date().toISOString(),
        testfield2: new Date().toISOString(),
        testfield3: new Date().toISOString(),
      };

      const eventTextType = {
        harry: 'potter',
        ron: 'weasley',
        leo: 'leung',
      };

      return controller.event.insertEvent('Wingardium Leviosa', eventDateType, eventTextType)
        .then(() => controller.event.findEvent('Wingardium Leviosa', '2017-10-10'))
        .then((results) => {
          assert(results.rows.length === 1);
        });
    });
  });
});

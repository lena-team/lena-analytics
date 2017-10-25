/* eslint-env mocha */
const { assert } = require('chai');
const cassandra = require('cassandra-driver');
const controller = require('../database/controller');

const keyspace = process.env.KEYSPACE || 'eventstore';
let contactPoints;
if (process.env.CONTACTPOINTS) {
  contactPoints = process.env.CONTACTPOINTS.split(',');
} else {
  contactPoints = ['104.237.154.8'];
}

const client = new cassandra.Client({ contactPoints, keyspace });

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
        testfield1: 'test1',
        testfield2: 'test2',
        testfield3: 'test3',
      };

      return controller.insertEvent('lol1', eventDateType, eventTextType)
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
        testfield1: 'test1',
        testfield2: 'test2',
        testfield3: 'test3',
      };

      return controller.insertEvent('lol1', eventDateType, eventTextType)
        .then(() => controller.findEvent('lol1', '2017-10-10'))
        .then((results) => {
          assert(results.rows.length === 1);
        });
    });
  });
});

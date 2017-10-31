DROP KEYSPACE IF EXISTS eventstore;

CREATE KEYSPACE eventstore WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 2 };

USE eventstore; 

CREATE TABLE events (
  id UUID,
  eventCreatedAt TIMESTAMP,
  eventType TEXT,
  eventDateType map <TEXT, TIMESTAMP>,
  eventTextType map<TEXT, TEXT>,
  eventIntType map<TEXT, INT>,
  PRIMARY KEY (eventType, eventCreatedAt, id)
);

DROP KEYSPACE IF EXISTS eventstore;

CREATE KEYSPACE eventstore WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };

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
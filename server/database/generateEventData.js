const { client } = require('./index.js');
const uuid = require('node-uuid');
const { sqs } = require('../config');

const generateRandomDate = (startDate, endDate) =>
  new Date(startDate.getTime() + (Math.random() * (endDate.getTime() - startDate.getTime())));

const generateRandomEventData = (startDate, endDate, maxProductLifeTimeDays) => {
  const generatedCreationDate = generateRandomDate(startDate, endDate);
  const generatedProductLTDays = Math.random() * maxProductLifeTimeDays;
  const generatedProductLTMs = generatedProductLTDays * 1000 * 60 * 60 * 24;
  const generatedUpdateDate = new Date(generatedCreationDate.getTime() + generatedProductLTMs);
  const deliveryStatus = Math.random() < 0.2 + (0.05 * generatedProductLTDays) ? 'cancelled' : 'delivered';

  return {
    text: {
      delivery_status: deliveryStatus,
    },
    date: {
      created_at: generatedCreationDate.toISOString(),
      updated_at: generatedUpdateDate.toISOString(),
    },
  };
};

// BatchInsert into DB
const generateBatchInsert = (repeatCount, eventType) => {
  const queryArray = [];
  for (let i = 0; i < repeatCount; i += 1) {
    const startDate = new Date();
    const endDate = new Date(new Date().getTime() + 8.64e+8);
    const generatedData = generateRandomEventData(startDate, endDate, 9);
    const queryItem = {
      query: 'INSERT INTO events (id, eventcreatedat, eventtype, eventdatetype, eventtexttype, eventinttype) VALUES (?, ?, ?, ?, ?, ?)',
      params: [
        uuid.v4(),
        new Date(new Date().getTime() + i).toISOString(),
        eventType,
        generatedData.date,
        generatedData.text,
        null,
      ],
    };
    queryArray.push(queryItem);
  }
  return client.batch(queryArray, { prepare: true });
};

// Generate SQS Data
const generateSQSData = () => {
  const startDate = new Date();
  const endDate = new Date(new Date().getTime() + 8.64e+8);
  const generatedData = generateRandomEventData(startDate, endDate, 9);
  const uuidNum = uuid.v4();

  return {
    Id: uuidNum,
    MessageDeduplicationId: uuidNum,
    MessageBody: JSON.stringify(generatedData),
    MessageGroupId: 'main',
  };
};

// Batch insert into AWS SQS
const batchInsertIntoSQS = (num) => {
  if (num > 10) {
    return undefined;
  }
  const Entries = [];
  for (let i = 0; i < num; i += 1) {
    Entries.push(generateSQSData());
  }
  const params = {
    Entries,
    QueueUrl: 'https://sqs.us-east-2.amazonaws.com/643418415510/lena.fifo',
  };

  sqs.sendMessageBatch(params, (err, data) => {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Success', data);
    }
  });
};


// Batch retrieve from AWS SQS
const batchRetrieveFromSQS = () => {
  let sqsData;
  const receiveParams = {
    QueueUrl: 'https://sqs.us-east-2.amazonaws.com/643418415510/lena.fifo',
    MaxNumberOfMessages: 10,
  };
  const deleteParams = {
    QueueUrl: 'https://sqs.us-east-2.amazonaws.com/643418415510/lena.fifo',
    Entries: [],
  };
  sqs.receiveMessage(receiveParams, (err, data) => {
    if (err) {
      console.log('err', err.stack);
    } else {
      sqsData = data;
      const deleteEntries = data.Messages.map(message => ({
        Id: message.MessageId,
        ReceiptHandle: message.ReceiptHandle,
      }));
      deleteParams.Entries = deleteEntries;
      const queryArray = data.Messages.map((message) => {
        const data = JSON.parse(message.Body);
        return {
          query: 'INSERT INTO events (id, eventcreatedat, eventtype, eventdatetype, eventtexttype, eventinttype) VALUES (?, ?, ?, ?, ?, ?)',
          params: [
            uuid.v4(),
            new Date().toISOString(),
            'test',
            data.date,
            data.text,
            null,
          ],
        };
      });
      return client.batch(queryArray, { prepare: true })
        .then(() => {
          sqs.deleteMessageBatch(deleteParams, (err1, data1) => {
            if (err) {
              console.log('err', err1.stack);
            } else {
              console.log(data1);
            }
          });
        });
    }
  });
};

// generation script
// setInterval(() => {
//   generateBatchInsert(20000, 'test');
// }, 5000);
// for (let i = 0; i < 100; i += 1) {
//   batchInsertIntoSQS(10);
// }
batchRetrieveFromSQS();

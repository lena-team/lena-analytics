const { client } = require('./index.js');
const uuid = require('node-uuid');

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

// generation script
setInterval(() => {
  generateBatchInsert(20000, 'test');
}, 5000);

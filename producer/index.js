const kafka = require('kafka-node');
require('dotenv').config();

const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });
const producer = new Producer(client);

// Function to generate random sensor data
const generateSensorData = () => {
  const sensorTypes = ['temperature', 'humidity', 'pressure'];
  const sensorId = `sensor-${Math.floor(Math.random() * 100)}`;
  const type = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
  const value =
    type === 'temperature'
      ? (Math.random() * 40).toFixed(2)
      : type === 'humidity'
      ? (Math.random() * 100).toFixed(2)
      : (Math.random() * 150).toFixed(2);

  return {
    sensorId,
    type,
    value: parseFloat(value),
    timestamp: new Date().toISOString(),
  };
};

producer.on('ready', () => {
  console.log('Kafka Producer is ready.');

  setInterval(() => {
    const sensorData = generateSensorData();
    const message = JSON.stringify(sensorData);

    producer.send(
      [{ topic: process.env.KAFKA_TOPIC, messages: [message] }],
      (err) => {
        if (err) {
          console.error('Error sending message:', err);
        } else {
          console.log('Message sent:', sensorData);
        }
      }
    );
  }, 2000); // Send every 2 seconds
});

producer.on('error', (err) => {
  console.error('Producer error:', err);
});

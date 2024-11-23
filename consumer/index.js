const kafka = require('kafka-node');
const mongoose = require('mongoose');
require('dotenv').config();
const SensorData = require('../models/SensorData');

const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });
const consumer = new Consumer(client, [{ topic: process.env.KAFKA_TOPIC, partition: 0 }], {
  autoCommit: true,
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 20,
  wtimeoutMS: 2500,
});

mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));

// Buffer for batch insertion
const BUFFER_SIZE = 100; // Maximum number of messages per batch
const INSERT_INTERVAL = 5000; // Interval to flush buffer (in milliseconds)
let sensorDataBuffer = [];

// Batch insert function
const flushBuffer = async () => {
  if (sensorDataBuffer.length > 0) {
    try {
      await SensorData.insertMany(sensorDataBuffer);
      console.log(`Inserted ${sensorDataBuffer.length} documents to MongoDB`);
      sensorDataBuffer = []; // Clear the buffer
    } catch (err) {
      console.error('Error during batch insert:', err);
    }
  }
};

// Set interval to periodically flush the buffer
setInterval(flushBuffer, INSERT_INTERVAL);

// Kafka Consumer Message Handler
consumer.on('message', (message) => {
  try {
    const sensorData = JSON.parse(message.value);
    console.log('Received message:', sensorData);

    sensorDataBuffer.push(sensorData);

    // Flush buffer if it reaches the maximum size
    if (sensorDataBuffer.length >= BUFFER_SIZE) {
      flushBuffer();
    }
  } catch (err) {
    console.error('Error processing message:', err);
  }
});

consumer.on('error', (err) => console.error('Consumer error:', err));

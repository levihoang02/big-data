const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema({
  sensorId: { type: String, required: true, index: true },
  type: { type: String, enum: ['temperature', 'humidity', 'pressure'], required: true },
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
});


SensorDataSchema.index({ sensorId: 1, timestamp: -1 });

module.exports = mongoose.model('SensorData', SensorDataSchema);

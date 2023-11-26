const mongoose = require('mongoose');

const MarketSchema = new mongoose.Schema({
  Borough: String,
  MarketName: String,
  StreetAddress: String,
  Latitude: Number,
  Longitude: Number,
  DaysOfOperation: String,
  HoursOfOperations: String,
  AcceptsEBT: String,
  FoodActivitiesForKids: String,
  LocationPoint: String
});

module.exports = mongoose.model('Market', MarketSchema);
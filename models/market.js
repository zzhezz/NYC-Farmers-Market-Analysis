const mongoose = require('mongoose');
const Review = require('./review');

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
  LocationPoint: String,
  Img: String,
  Description: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

MarketSchema.post('findOneAndDelete', async function(doc){
  if(doc){
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

module.exports = mongoose.model('Market', MarketSchema);
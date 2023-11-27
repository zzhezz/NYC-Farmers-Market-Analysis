var express = require('express');
var app = express();
const path = require('path');
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const Market = require('./models/market');
const methodOverride = require('method-override');
const Review = require('./models/review');

require('dotenv').config();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
const map_api = process.env.mapboxToken;
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
const axios = require('axios');

mongoose.connect("mongodb://127.0.0.1:27017/farmers-market", {
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () =>{
  console.log("Database connected");
});

app.get('/', (req, res) => {
    res.render('main');
});

app.get('/map', (req,res)=>{
    res.render('test');
})

app.get('/search', (req, res) => {
    res.render('search');
});

app.get('/markets', async (req, res)=>{
  const markets = await Market.find({});
  res.render('markets/index', { markets })
});

app.get('/markets/new', (req, res) => {
    res.render('markets/new');
})

app.post('/markets', async (req, res) => {
    const market = new Market(req.body.market);
    await market.save();
    res.redirect(`/markets/${market._id}`)
})

app.get('/markets/:id', async (req, res,) => {
    const market = await Market.findById(req.params.id).populate('reviews');
    res.render('markets/show', { market });
});

app.get('/markets/:id/edit', async (req, res) => {
    const market = await Market.findById(req.params.id)
    res.render('markets/edit', { market });
})

app.put('/markets/:id', async (req, res) => {
    const { id } = req.params;
    const market = await Market.findByIdAndUpdate(id, { ...req.body.market });
    res.redirect(`/markets/${market._id}`)
});

app.delete('/markets/:id', async (req, res) => {
    const { id } = req.params;
    await Market.findByIdAndDelete(id);
    res.redirect('/markets');
})

app.post('/markets/:id/reviews', async (req, res) => {
    const market = await Market.findById(req.params.id);
    const review = new Review(req.body.review);
    market.reviews.push(review);
    await review.save();
    await market.save();
    res.redirect(`/markets/${market._id}`);
})

app.delete('/markets/:id/reviews/:reviewId', async (req, res) => {
    const { id, reviewId } = req.params;
    await Market.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/markets/${id}`);
})

app.get('/results', async(req, res) => {
    // Extract the query parameters from the request
    const { borough, marketName, daysOpened, activities, acceptsEBT, communityDistrict } = req.query;

    // Note: Adjust the filtering logic based on how the API response is structured
    try {
        // Fetch the market data from the API
        const apiResponse = await axios.get('https://data.cityofnewyork.us/resource/8vwk-6iz2.json');

        const filteredMarkets = apiResponse.data.filter(market => {
            return (
                (!borough || (market.borough && market.borough.toLowerCase() === borough.toLowerCase())) &&
                (!marketName || (market.marketname && market.marketname.toLowerCase().includes(marketName.toLowerCase()))) &&
                (!daysOpened || (market.daysoperation && market.daysoperation.toLowerCase()===daysOpened.toLowerCase())) &&
                (!activities || (market.kids && market.kids.toLowerCase() === activities.toLowerCase())) &&
                (!acceptsEBT || (market.accepts_ebt && market.accepts_ebt.toLowerCase() === acceptsEBT.toLowerCase())) &&
                (!communityDistrict || (market.community_district && market.community_district === communityDistrict))
            );
        });

        // Render the results page with the filtered markets data
        res.render('results', { markets: filteredMarkets });
    } catch (err) {
        console.error("Error: " + err.message);
        res.status(500).send("An error occurred while fetching data");
    }
});

app.listen(3000, ()=>{
    console.log("Port 3000 connected");
})
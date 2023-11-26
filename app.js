var express = require('express');
var app = express();
const path = require('path');
require('dotenv').config();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
const map_api = process.env.mapboxToken;
const axios = require('axios');


app.get('/', (req, res) => {
    res.render('main');
});

app.get('/map', (req,res)=>{
    res.render('test');
})

app.get('/search', (req, res) => {
    res.render('search');
});

app.get('/results', async(req, res) => {
    // Extract the query parameters from the request
    const { borough, marketName, daysOpened, activities, acceptsEBT, communityDistrict } = req.query;

    // Note: Adjust the filtering logic based on how the API response is structured
    try {
        // Fetch the market data from the API
        const apiResponse = await axios.get('https://data.cityofnewyork.us/resource/8vwk-6iz2.json');

        const filteredMarkets = apiResponse.data.filter(market => {
            if((!borough || (market.borough && market.borough.toLowerCase() === borough.toLowerCase())) &&
                (!marketName || (market.marketname && market.marketname.toLowerCase().includes(marketName.toLowerCase()))) &&
                (!daysOpened || (market.daysoperation && market.daysoperation.toLowerCase()===daysOpened.toLowerCase())) &&
                (!activities || (market.kids && market.kids.toLowerCase() === activities.toLowerCase())) &&
                (!acceptsEBT || (market.accepts_ebt && market.accepts_ebt.toLowerCase() === acceptsEBT.toLowerCase())) &&
                (!communityDistrict || (market.community_district && market.community_district === communityDistrict))){
                    console.log(market);
                }

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
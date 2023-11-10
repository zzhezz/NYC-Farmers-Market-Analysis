var express = require('express');
var app = express();
const path = require('path');
require('dotenv').config();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
const map_api = process.env.mapboxToken;

app.get('/', (req, res) => {
    res.render('main');
});

app.get('/map', (req,res)=>{
    res.render('test');
})

app.listen(3000, ()=>{
    console.log("Port 3000 connected");
})
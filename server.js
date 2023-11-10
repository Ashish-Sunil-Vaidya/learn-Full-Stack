//Load all env variables if app is hosted to production
if (process.env.NODE_ENV !== 'production') {
    console.log("Hosted in production");
    require('dotenv').config();
}
else{
    console.log("Hosted in development");
}


// Intialize varaibles required to run the server
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const productionPORT = process.env.PORT;
const allRoutes = require('./routes');
const mongoose = require("mongoose");
const db = mongoose.connection;

// Set properties of server
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

// To apply all the routes  
app.use(allRoutes);

// Connect to mongodb
mongoose.connect(process.env.DB_URL);

// Check if it's connected
db.on('open', () => {
    console.log("Connection Successfull...");
})
db.on('error', () => {
    console.log("Connection failed...");
})

//Use .env for production for dev use 3000
app.listen(productionPORT || 3000, () => {
    console.log("Server connection to port: " + (productionPORT || 3000));
})
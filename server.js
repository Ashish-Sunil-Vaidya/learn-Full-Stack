//Load all env variables if app is hosted to production
if (process.env.NODE_ENV !== 'production') {
    console.log("Hosted in production");
    require('dotenv').config();
}
else {
    console.log("Hosted in development");
}


// Intialize varaibles required to run the server
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const productionPORT = process.env.PORT;
const indexRouter = require('./routes/index');
const authorsRouter = require('./routes/authours');
const booksRouter = require('./routes/books')
const mongoose = require("mongoose");
const db = mongoose.connection;
const bodyParser = require('body-parser');
const methodOverride = require('method-override')

// Set properties of server
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

// By default, options for handling put & delete requests are not available in the browser itself so we use method-override over the browser methods to perform put and delete requests.
app.use(methodOverride('_method'));

// Body Parser is a middleware that is used to parse the incoming request bodies. It is used to extract the entire body portion of an incoming request stream and exposes it on req.body. The middleware is available under the req.body property.
app.use(bodyParser.urlencoded({ limit: '10mb', extended: 'false' }));

// To apply all the routes  
app.use('/', indexRouter);
app.use('/authors', authorsRouter);
app.use('/books',booksRouter);

// Connect to mongodb
mongoose.connect(process.env.DB_URL);
// Check if it's connected
db.on('open', () => {
    console.log("Connection Successful ✔️");
})
db.on('error', () => {
    console.error("Connection failed ❌");
})

//Use .env for production for dev use 3000
app.listen(productionPORT || 3000, () => {
    console.log("Server connection to port: " + (productionPORT || 3000));
    console.log('Connecting to Database ...');
})
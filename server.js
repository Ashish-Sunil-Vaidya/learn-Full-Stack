

// Intialize varaibles required to run the server
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const indexRouter = require('./routes/index');
const authorsRouter = require('./routes/authours');
const booksRouter = require('./routes/books')
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const DB_URL = "mongodb://localhost:27017";

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
app.use('/books', booksRouter);

console.log('Connecting to Database ...');
// Connect to mongodb
mongoose.connect(DB_URL).then((result) => {
    console.log("Connection Successful ✔️");
    app.listen(3000, () => {
        console.log("Server connection to port: 3000");
    })
}).catch((err) => {
    console.log("Connection failed ❌");
    console.log(err);
})


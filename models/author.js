// import mongoose
const mongoose = require("mongoose");

// intialize Schema
const Schema = mongoose.Schema;

// Create a Schema for Author
const authorSchema = new Schema({
    name:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Author',authorSchema);


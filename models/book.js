// import mongoose
const mongoose = require("mongoose");

// Base path of book cover image
const path = require('path');
const imageBasePath = 'uploads/bookCovers';

// intialize Schema
const Schema = mongoose.Schema;

// Create a Schema for Book
const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishedDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        // Reference another Schema by 'mongoose.Schema.Types.ObjectId' and ref = 'modelName'
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
}, {
    timestamps: true
})

bookSchema.virtual('coverImagePath').get(function () {
    if (this.coverImageName != null) {
        return path.join('/', imageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Book', bookSchema);
module.exports.imageBasePath = imageBasePath;


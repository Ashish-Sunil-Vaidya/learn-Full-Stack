// import mongoose
const mongoose = require("mongoose");

// intialize Schema
const Schema = mongoose.Schema;
const Book = require('./book');

// Create a Schema for Author
const authorSchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre("findOneAndDelete", async function (next) {
    try {
        const query = this.getFilter();
        const hasBook = await Book.exists({ author: query._id });

        if (hasBook) {
            next(new Error("This author still has books."));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Author', authorSchema);


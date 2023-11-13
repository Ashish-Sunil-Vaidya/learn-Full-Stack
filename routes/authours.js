const express = require("express");
const router = express.Router();
const Author = require('../models/author');
const Book = require("../models/book");

// Get All Authors
router.get('/', async (req, res) => {
    let searchOptions = {};
    if (req.query.name) {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    try {

        const authors = await Author.find(searchOptions);
        res.render('authors/index', { authors: authors, searchOptions: req.query });

    } catch (error) {
        res.redirect('/');
    }
})

// Form to create new Author
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

// Creates a new Author
router.post('/', async (req, res) => {
    const author = new Author({ name: req.body.name })
    try {
        const newAuthor = await author.save();
        // res.redirect(`/authors/${newAuthor.id}`)
        res.redirect('authors');
    } catch (err) {
        res.render('authors/new', {
            author: author,
            error: "Invalid Author name"
        });
    }
});

// Shows selected author's profile
router.get('/:id', async(req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({ author: author.id }).limit(6).exec();
        res.render('authors/show', { author: author, booksByAuthor: books })
    }
    catch (err) {
        console.log('=== error authours.js [43] ===', err);
        res.redirect('/')
    }

})

// Edit Form
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        // console.log('=== author authours.js [50] ===', author.name);
        res.render('authors/edit', { author: author })
    } catch (err) {
        res.redirect('/authors')
    }
})

// Updates profile info
router.put('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`);
    } catch (error) {
        if (!author) {
            res.redirect('/')
        }
        else {
            console.log('=== error authours.js [67] ===', error);
            res.render('authors/edit', {
                author: author,
                errorMessage: "Error editing author"
            })
        }
    }
})

// Deletes selected profile
// Deletes selected profile
router.delete('/:id', async (req, res) => {
    try {
        await Author.findOneAndDelete({ _id: req.params.id });
        res.redirect(`/authors`);
    } catch (error) {
        console.log('=== error authours.js [92] ===', error);

        res.redirect('/authors');
    }
});




module.exports = router;
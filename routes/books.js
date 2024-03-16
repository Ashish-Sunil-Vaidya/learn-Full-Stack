const express = require("express");
const router = express.Router();
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const Book = require('../models/book');
const Author = require('../models/author');


// Get All Books Route
router.get('/', async (req, res) => {
    let query = Book.find();
    if (req.query.title) {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore) {
        query = query.lte('publishedDate', req.query.publishedBefore);
    }
    if (req.query.publishedAfter) {
        query = query.gte('publishedDate', req.query.publishedAfter);
    }


    try {
        const books = await query.exec();
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch (err) {
        res.redirect('/');
    }
})

// Form to create new Book Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());
    // console.log('=== Form books.js [33] ===');
})

// Creates a new Book Route
router.post('/', async (req, res) => {

    const filename = req.file ? req.file.filename : null;
    const [year, month, day] = req.body.publishedDate.split('-');
    const publishedDate = new Date(Date.UTC(year, month - 1, day));

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishedDate: publishedDate,
        pageCount: req.body.pageCount,
        description: req.body.description
    });
    saveCover(book, req.body.cover);
    try {
        const newBook = await book.save();

        res.redirect('books');
    } catch (error) {

        renderNewPage(res, book, true);
    }
});

const renderNewPage = async (res, book, hasError = false) => {
    try {
        const authors = await Author.find({});// {} means no conditions for find()
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            params.errorMessage = 'Error creating book'
        }
        res.render('books/new', params)
    } catch (err) {
        res.redirect('books');
    }
}


const saveCover = (book, coverEncoded) => {

    const cover = JSON.parse(coverEncoded);
    if (cover && imageMimeTypes.includes(cover.type)) {

        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }
    else return;
}


// Shows selected Book's profile
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('author')
            .exec();
        res.render('books/show', { book: book })
    }
    catch (err) {
        console.log('=== error books.js [43] ===', err);
        res.redirect('/')
    }

})

// Edit Form
router.get('/:id/edit', async (req, res) => {
    const book = await Book.findById(req.params.id);
    try {
        // console.log('=== book books.js [50] ===', book.title);
        book.title = req.body.title;
        book.author = req.body.author;
        book.publishedDate = req.body.publishedDate;
        book.pageCount = req.body.pageCount;
        book.description = req.body.description;
        if (req.body.cover) {
            saveCover(book, req.body.cover);
        }
        await book.save();
        res.redirect(`/books/${book.id}`);

    } catch (err) {
        if(book) {
            renderEditPage(res, book,true);
        }
        else {
            res.redirect('/');
        }
    }
})

const renderEditPage = async (res, book, hasError = false) => {
    try {
        const authors = await Author.find({});// {} means no conditions for find()
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            params.errorMessage = 'Error editing book'
        }
        res.render('books/edit', params)
    } catch (err) {
        res.redirect('books');
    }
}


module.exports = router;
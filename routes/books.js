const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const Book = require('../models/book');
const uploadPath = path.join('public', Book.imageBasePath);
const Author = require('../models/author');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        cb(null, imageMimeTypes.includes(file.mimetype));
    }
});
const fs = require('fs')

// Get All Books
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

// Form to create new Book
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());
    // console.log('=== Form books.js [33] ===');
})

// Creates a new Book
router.post('/', upload.single('cover'), async (req, res) => {

    const filename = req.file ? req.file.filename : null;
    const [year, month, day] = req.body.publishedDate.split('-');
    const publishedDate = new Date(Date.UTC(year, month - 1, day));

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishedDate: publishedDate,
        pageCount: req.body.pageCount,
        coverImageName: filename,
        description: req.body.description
    });
    try {
        const newBook = await book.save();
        // console.log('=== Book Created books.js [50] ===', book, req.body.publishedDate);
        res.redirect('books');
    } catch (error) {
        removeBookCover(filename);
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
            params.error = 'Error creating book'
            // console.log('=== error books.js [65] ===', error);
        }
        res.render('books/new', params)
    } catch (err) {
        res.redirect('books');
    }
}

const removeBookCover = (filename) => {
    fs.unlink(path.join(uploadPath, filename), (err) => {
        console.error(err);
    })
}


module.exports = router;
const mongoose = require('mongoose');
const Author = require('./author.model');
const Genre = require('./genre.model');

const Schema = mongoose.Schema;

//if this dosen't work add a array declaration as default value
var book = new Schema({
    bookName: String,
    averageReviewScore: Int16Array,
    author: [Author],
    genre: [Genre],
});

const Book = mongoose.model('Book', book);
module.exports = Book;

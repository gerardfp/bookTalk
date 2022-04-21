const mongoose = require('mongoose');
const Author = require('./author.model');
const Genre = require('./genre.model');

const Schema = mongoose.Schema;

var book = new Schema({
    bookName: String,
    averageReviewScore: Int16Array,
    author: [Author],
    genre: [Genre]
});

const Book = mongoose.model('Book', book);
module.exports = Book;

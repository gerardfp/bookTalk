const mongoose = require('mongoose');
const Author = require('./author.model');
const Genre = require('./genre.model');

const Schema = mongoose.Schema;

var book = new Schema({
    bookName: String,
    averageReviewScore: {
        type : Number,
        default : 0
    },
    author: [Author.schema],
    genre: [Genre.schema]
});

const Book = mongoose.model('Book', book);
module.exports = Book;

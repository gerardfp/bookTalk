const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var review = new Schema({
    reviewTitle: String,
    reviewScore: Number,
    reviewText: Text,
    bookImage: String, //route to file
    numberOfLikes: Number,
    bookId: String
});

const Review = mongoose.model('Review', review);
module.exports = Review;
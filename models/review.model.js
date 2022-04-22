const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var review = new Schema({
    reviewTitle: String,
    reviewScore: Int16Array,
    reviewText: Text,
    bookImage: String, //route to file
    numberOfLikes: Int16Array,
    bookId: String
});

const Review = mongoose.model('Review', review);
module.exports = Review;
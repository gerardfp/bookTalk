const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var review = new Schema({
    reviewTitle: String,
    reviewScore: Number,
    reviewText: String,
    bookImage: String, //route to file
    numberOfLikes: Number,
    bookId: String,
    username: String
});

const Review = mongoose.model('Review', review);
module.exports = {model:Review,schema:review};
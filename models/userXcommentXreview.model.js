const mongoose = require('mongoose');
const Commentary = require('./commentary.model');
const Review = require('./review.model');
const User = require('./user.model');

const Schema = mongoose.Schema;

var userXcommentXreview = new Schema({
    user: User.schema,
    review: Review.schema,
    comments: [Commentary.schema]
});

const UserXcommentXreview = mongoose.model('UserXcommentXreview', userXcommentXreview);
module.exports = UserXcommentXreview;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user.model');

var commentary = new Schema({
    commentText: String,
    likes: [User.schema],
    timeStamp: Date
});

const Commentary = mongoose.model('Commentary', commentary);
module.exports = {model:Commentary,schema:commentary};

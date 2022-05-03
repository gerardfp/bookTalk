const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentary = new Schema({
    commentText: String,
    numOfLikes: Number,
    timeStamp: Date
});

const Commentary = mongoose.model('Commentary', commentary);
module.exports = {model:Commentary,schema:commentary};

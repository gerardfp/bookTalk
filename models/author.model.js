const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var author = new Schema({
    completeName: String,
    wikipediaLink: String
});

const Author = mongoose.model('Author', author);
module.exports = Author;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var genre = new Schema({
    name: String,
    description: Text
});

const Genre = mongoose.model('Genre', genre);
module.exports = Genre;

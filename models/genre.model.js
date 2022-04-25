const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var genre = new Schema({
    name: String,
    description: String
});

const Genre = mongoose.model('Genre', genre);
module.exports = {model:Genre,schema:genre};

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var favourites = new Schema({
    username: String,
    idBook: String
});

const Favourites = mongoose.model('Favourites', favourites);
module.exports = {model:Favourites,schema:favourites};
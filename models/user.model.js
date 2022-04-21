const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var user = new Schema({
    username: String,
    completeName: String,
    birthDate: Date,
    password: String,
    profilePicture: {
        type : String,
        default : ' '
    }, //file path
    biography: {
        type : Text,
        default : ' '
    },
    email: String,
    type: {
        type: String,
        default: "normal"
    } //admin or normal
});

const User = mongoose.model('User', user);
module.exports = User;

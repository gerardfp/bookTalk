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
        type : String,
        default : ' '
    },//can be edit when the user is already created
    email: String,
    type: {
        type: String,
        default: "normal"
    } //admin or normal
});

const User = mongoose.model('User', user);
module.exports = {model:User,schema:user};
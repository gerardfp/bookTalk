const mongoose = require('mongoose');
const Commentary = require('./commentary.model');
const Schema = mongoose.Schema;

var userXcommentXreview = new Schema({
    userid: String,
    reviewid: String,
    comments: [Commentary.schema]
});

const UserXcommentXreview = mongoose.model('UserXcommentXreview', userXcommentXreview);
module.exports = {model:UserXcommentXreview,schema:userXcommentXreview};
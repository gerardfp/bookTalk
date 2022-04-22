var Author = require('../models/author.model.js');

exports.save = (req, res, next) => { 
    let author = new Author({completeName: req.body.authorName, wikipediaLink: req.body.wikipedialink});
    console.log(author);
    author.save();
    res.redirect("/");
}

exports.get = async (req, res, next) => {
    let authors = await Author.find({ name: req.body.authorName }).exec();
}


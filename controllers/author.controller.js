var Author = require('../models/author.model.js');

exports.save = (req, res, next) => { 
    let author = new Author.model({completeName: req.body.authorName, wikipediaLink: req.body.wikipedialink});
    console.log(author);
    author.save();
    res.redirect("/");
}

exports.get = (req, res, next) => {
    Author.model.find(function(err, authors) {
        req.authors = authors;
        next();
    });
}
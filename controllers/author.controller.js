var Author = require('../models/author.model.js');

exports.save = async (req, res, next) => {

    let author = await Author.model.findOne({completeName: req.body.authorName,wikipediaLink: req.body.wikipedialink});
    if (author == undefined) {
        let author = new Author.model({completeName: req.body.authorName.toLowerCase(), wikipediaLink: req.body.wikipedialink});
        console.log(author);
        author.save();
    } else {
        console.log("author already in the database");
    }
    res.redirect("/");
}

exports.get = (req, res, next) => {
    Author.model.find(function(err, authors) {
        req.authors = authors;
        next();
    });
}
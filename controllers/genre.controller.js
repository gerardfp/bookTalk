var Genre = require('../models/genre.model.js');

exports.save = (req, res, next) => { 
    let genre = new Genre.model({name: req.body.genreName, description: req.body.description});
    console.log(genre);
    genre.save();
    res.redirect("/");
}

exports.get = (req, res, next) => {
    Genre.model.find(function(err, genres) {
        req.genres = genres;
        next();
    });
}
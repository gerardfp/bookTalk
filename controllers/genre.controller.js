var Genre = require('../models/genre.model.js');

exports.save = async (req, res, next) => { 
    let genre = await Genre.model.findOne({name: req.body.genreName, description: req.body.description});
    if (genre == undefined) {
        let genre = new Genre.model({name: req.body.genreName.toLowerCase(), description: req.body.description});
        console.log(genre);
        genre.save();
    } else {
        console.log("genre already in the database");
    }
    res.redirect("/");
}

exports.get = (req, res, next) => {
    Genre.model.find(function(err, genres) {
        req.genres = genres;
        next();
    });
}
var Book = require('../models/book.model.js');
var User = require('../models/user.model.js');
var Favourites = require('../models/favourites.model.js');

//la id del book ve per la ruta, el username per session
exports.addFavouriteOrRemove = async (req, res, next) => {
    let testBookExist = await Book.findOne({_id: req.param.idBook});
    let testFavouritesExist = await Favourites.findOne({username: req.session.username, idBook: req.param.idBook});
    if (req.session.username != null && testBookExist != null && testFavouritesExist == null) {
        let fav = new Favourites({username: req.session.username, idBook: req.param.idBook});
        fav.save();
    } else if (req.session.username != null && testFavouritesExist != null) {
        let testFavouritesExist = await Favourites.deleteOne({username: req.session.username, idBook: req.param.idBook});
    }
    res.redirect('back');
}

exports.getFavouritesByUser = async (req, res, next) => {
    if (req.session.username != null) {
        let favouritesOfUser = await Favourites.find({username: req.session.username});
        req.listFavouritesOfUser = favouritesOfUser;
    }
    next();
}


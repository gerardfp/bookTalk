var Book = require('../models/book.model.js');
var User = require('../models/user.model.js');
var Favourites = require('../models/favorites.model.js');

//la id del book ve per la ruta, el username per session
exports.addFavouriteOrRemove = async (req, res, next) => {
    let testBookExist = await Book.findOne({_id: req.params.idBook});
    let testFavouritesExist = await Favourites.model.findOne({username: req.session.username, idBook: req.params.idBook});
    if (req.session.username != null && testBookExist != null && testFavouritesExist == null) {
        let fav = new Favourites.model({username: req.session.username, idBook: req.params.idBook});
        fav.save();
    } else if (req.session.username != null && testFavouritesExist != null) {
        let testFavouritesExist = await Favourites.model.deleteOne({username: req.session.username, idBook: req.params.idBook});
    }
    res.redirect('back');
}

exports.getFavouritesByUser = async (req, res, next) => {
    if (req.session.username != null) {
        let favouritesOfUser = await Favourites.model.find({username: req.session.username});
        let idOfBooks = new Array;
        favouritesOfUser.forEach(element => {
            idOfBooks.push(element.idBook);
        });
        let listOfBooksFound = await Book.find({_id: {$in: idOfBooks}});
        req.listFavouritesOfUser = listOfBooksFound;
    }
    next();
}


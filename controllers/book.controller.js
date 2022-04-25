var Book = require('../models/book.model.js');
const Author = require('../models/author.model');
const Genre = require('../models/genre.model');


exports.save = (req, res, next) => { 
    let getAuthor = req.body.author;
    let author = Author.model.findOne({completeName: getAuthor});
    //mirar de ficar await, que agafa nomes la cadena de text, no la query
    let getGenre = req.body.genre;
    let genre = Genre.model.findOne({name: getGenre});

    console.log(author + " " + genre);

    let book = new Book({bookName: req.body.bookName, author: req.body.author, genre: req.body.genre});
    console.log(book);
    book.save();
    res.redirect("/");
}
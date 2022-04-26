var Book = require('../models/book.model.js');
const Author = require('../models/author.model');
const Genre = require('../models/genre.model');


exports.save = async (req, res, next) => { 
    //get author name and search it to grab the model
    let getAuthor = req.body.author;
    let author = await Author.model.findOne({completeName: getAuthor});

    //get genre name and search it to grab the model
    let getGenre = req.body.genre;
    let genre = await Genre.model.findOne({name: getGenre});

    console.log(author + " " + genre);

    //save the book
    let book = new Book({bookName: req.body.bookName, author: author, genre: genre});
    console.log(book);
    book.save();
    res.redirect("/");
}
var Book = require('../models/book.model.js');
const Author = require('../models/author.model');
const Genre = require('../models/genre.model');


exports.save = async (req, res, next) => { 

    //substituir aquesta part per foreach, per les multiples consultes
    //get author name and search it to grab the model
    let getAuthor = req.body.authors;    
    let authorList = new Array;
    for(let element of getAuthor){
        let author = await Author.model.findOne({completeName: element});
        authorList.push(author);
    };

    //get genre name and search it to grab the model
    let getGenre = req.body.genres;
    let genreList = new Array;
    for(let element of getGenre){
        let genre = await Genre.model.findOne({name: element});
        genreList.push(genre);
    }

    //save the book
    let testSearchBook = await Book.findOne({bookName: req.body.bookName, author: authorList, genre: genreList});
    if (testSearchBook == undefined) {
        let book = new Book({bookName: req.body.bookName, author: authorList, genre: genreList});
        console.log(book);
        book.save();
    } else {
        console.log("book alredy in the database");
    }
    res.redirect("/");
}
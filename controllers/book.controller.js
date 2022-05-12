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
        let book = new Book({bookName: req.body.bookName.toLowerCase(), author: authorList, genre: genreList});
        console.log(book);
        book.save();
    } else {
        console.log("book alredy in the database");
    }
    res.redirect("/");
}

exports.list  = async (req, res, next) => {
    req.allBooksList = await Book.find();
    console.log(req.allBooksList);
    next();
}

exports.filterList  = async (req, res, next) => {
    let userInput = req.body.text.toLowerCase();
    let resultQueryBooks = await Book.find({ bookName: new RegExp(userInput) });
    console.log(resultQueryBooks);
    res.json(resultQueryBooks);
    return;
}

exports.bookTitle  = async (req, res, next) => {
    let userInput = req.body.idOfBook.toLowerCase();
    console.log(userInput);
    let resultQueryBooks = await Book.findOne({ _id: userInput });
    console.log(resultQueryBooks);
    res.json(resultQueryBooks);
    return;
}

exports.searchBooksForSearcher = async (req, res, next) => {
    let userQuery = req.body.userInput;
    let booksFound = await Book.find({bookName: new RegExp(userQuery)});
    res.json(booksFound);
    return;
}

exports.searchBooksForGenre = async (req, res, next) => {
    let userQuery = req.body.genre;
    let genresUserWants = await Genre.model.find({name :userQuery}).select(["name", '-_id']);
    let listOfGenres = new Array;
    genresUserWants.forEach(element => {
        listOfGenres.push(element.name);
    });
    let listOfBooksFound = await Book.find({genre: {$elemMatch: {name:  {$in: listOfGenres}}}});
    res.render('searchResult.pug',{booksFound: listOfBooksFound});
}

exports.aBook = async (req, res, next) => {
    let booksFound = await Book.findOne({_id:req.params.idBook });
    req.booksFound = booksFound;
    console.log("AAAAAAAAAAAAAAAAAa");
    next();
}
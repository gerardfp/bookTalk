/*
  /routes/index.js
*/
const express = require('express');
const router = express.Router();
const path = require('path');

//required of needed controllers
var authorController = require('../controllers/author.controller.js');
var bookController = require('../controllers/book.controller.js');
var genreController = require('../controllers/genre.controller.js');

//Middleware para mostrar datos del request
router.use (function (req,res,next) {
  console.log('/' + req.method);
  next();
});

//Analiza la ruta y el protocolo y reacciona en consecuencia
router.get('/',function(req,res){
  res.sendFile(path.resolve('views/test.html'));
});

//book
router.get('/book/add',genreController.get);
router.get('/book/add',authorController.get);
router.get('/book/add',function(req,res){
  let listOfAuthors = new Array;
  req.authors.forEach(function(entry) {
    let author = {id: entry._id, completename: entry.completeName};
    listOfAuthors.push(author);
  });

  listOfAuthors = JSON.stringify(listOfAuthors);
  console.log(listOfAuthors);

  let listOfGenres = new Array;
  req.genres.forEach(function(entry) {
    let genre = {id: entry._id, name: entry.name};
    listOfGenres.push(genre);
  });
  listOfGenres = JSON.stringify(listOfGenres);
  console.log(listOfGenres);

  res.render('createBook.pug',{authorList: listOfAuthors, genreList: listOfGenres});
});
router.post('/book/add/save',bookController.save);

//author
router.get('/author/add',function(req,res){
  res.render('createAuthor.pug');
});
router.post('/author/add/save',authorController.save);
router.post('/author/search',authorController.get);

//genre
router.get('/genre/add',function(req,res){
  res.render('createGenre.pug');
});
router.post('/genre/add/save',genreController.save);

module.exports = router;
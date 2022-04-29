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
var reviewController = require('../controllers/review.controller.js');
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
  res.render('createBook.pug',{authorList: req.authors, genreList: req.genres});
});
router.post('/book/add/save',bookController.save);

//AQUESTA NO S'UTILITZA
router.get('/book/list/all',bookController.list);
router.get('/book/list/alll', function(req,res){
  res.render('listOfBooks.pug', {listOfBooks: req.allBooksList});
});

router.post('/book/list/query',bookController.filterList);


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


//review
router.get('/review/add',function(req,res){
  res.render('createReview.pug');
});
router.post('/review/add/save',reviewController.save);

module.exports = router;
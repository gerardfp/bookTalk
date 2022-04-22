/*
  /routes/index.js
*/
const express = require('express');
const router = express.Router();
const path = require('path');

//required of needed controllers
var authorController = require('../controllers/author.controller.js');

//Middleware para mostrar datos del request
router.use (function (req,res,next) {
  console.log('/' + req.method);
  next();
});

//Analiza la ruta y el protocolo y reacciona en consecuencia
router.get('/',function(req,res){
  res.sendFile(path.resolve('views/test.html'));
});

//test form routes
router.get('/book/add',function(req,res){
  res.render('createBook.pug');
});

router.get('/author/add',function(req,res){
  res.render('createAuthor.pug');
});
router.post('/author/add/save',authorController.save);
router.post('/author/search',authorController.get);

module.exports = router;
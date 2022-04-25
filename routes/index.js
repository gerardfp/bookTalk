/*
  /routes/index.js
*/
const express = require('express');
const router = express.Router();
const path = require('path');
const UserController = require('../controllers/user.controller.js');



//Middleware para mostrar datos del request
router.use (function (req,res,next) {
  console.log('/' + req.method);
  next();
});

//Analiza la ruta y el protocolo y reacciona en consecuencia
router.get('/',function(req,res){
  res.sendFile(path.resolve('views/test.html'));
});

router.get('/test',function(req,res){
  res.render('userEdit.pug');
});

router.get('/user/signup',function(req,res){
  res.render('register.pug');
});

router.post('/user/signup/save', UserController.register);

router.get('/user/signin',function(req,res){
  res.render('login.pug');
});

router.post('/user/signin/save', UserController.login);

module.exports = router;
/*
  /routes/index.js
*/
const express = require('express');
const router = express.Router();
const path = require('path');
const UserController = require('../controllers/user.controller.js');
const session = require('express-session');

connectedUsers = Array();

//Middleware para mostrar datos del request
router.use (function (req,res,next) {
  console.log('/' + req.method);
  next();
});

router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

//Analiza la ruta y el protocolo y reacciona en consecuencia
router.get('/',function(req,res){
  res.render('home.pug', {username: req.session.username, completeName: req.session.completeName, birthDate: req.session.birthDate, email: req.session.email})
});

router.get('/user/edit',function(req,res){
  res.render('userEdit.pug', {username: req.session.username, completeName: req.session.completeName, birthDate: req.session.birthDate, email: req.session.email})
});

router.post('/user/edit/params', UserController.edit);

router.get('/user/signup',function(req,res){
  res.render('register.pug', {username: req.session.username, completeName: req.session.completeName, birthDate: req.session.birthDate, email: req.session.email})
});

router.post('/user/signup/save', UserController.register);

router.get('/user/signin',function(req,res){
  res.render('login.pug', {username: req.session.username, completeName: req.session.completeName, birthDate: req.session.birthDate, email: req.session.email})
});

router.post('/user/signin/save', UserController.login);

module.exports = router;
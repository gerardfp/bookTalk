/*
  /routes/index.js
*/
var User = require('../models/user.model');
const express = require('express');
const router = express.Router();
const path = require('path');
const UserController = require('../controllers/user.controller.js');
const session = require('express-session');
const formidable = require('formidable');
var fs = require('fs');
var app = require('../app.js');


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

//Home
router.get('/',function(req,res){
  res.render('home.pug', {username: req.session.username, completeName: req.session.completeName, birthDate: req.session.birthDate, email: req.session.email})
});

//Register
router.get('/user/signup',function(req,res){
  res.render('register.pug', {username: req.session.username, completeName: req.session.completeName, birthDate: req.session.birthDate, email: req.session.email})
});

router.post('/user/signup/save', UserController.register);

//Login
router.get('/user/signin',function(req,res){
  res.render('login.pug', {username: req.session.username, completeName: req.session.completeName, birthDate: req.session.birthDate, email: req.session.email})
});

router.post('/user/signin/save', UserController.login);

//Modify User
router.get('/user/edit',function(req,res){
  console.log(req.session.profilePicture);
  res.render('userEdit.pug', {username: req.session.username, completeName: req.session.completeName, birthDate: req.session.birthDate, email: req.session.email, biography: req.session.biography, profilePicture: req.session.profilePicture})
});

router.post('/user/edit/params', UserController.edit);
router.post('/user/edit/img', function(req, res, next){
  const form = formidable({ });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    //res.json({ fields, files });

    let filePath = files.profilePicture.filepath;
    var sess = req.session;
    let newName = sess.username;
    let picture = app.filesPath.split("/");
    let posPicture = picture[7] + "/" + picture[8] + "/" + newName + "." + files.profilePicture.mimetype.split("/")[1];
    console.log(posPicture);
    console.log(app.filesPath);
    fs.rename(filePath, app.filesPath + newName + "." + files.profilePicture.mimetype.split("/")[1] , function(err) {
      if (err) throw err
      
      console.log('Succesfully');
    });
    User.findOneAndUpdate({username: sess.username}, {profilePicture: "../" + posPicture}, function(err, user) {
      user.save();
    });
    sess.profilePicture = "../" + "../" + posPicture;
  });
  

  res.redirect('/user/edit');
});
module.exports = router;
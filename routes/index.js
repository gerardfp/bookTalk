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

//User
router.get('/user/:username', function(req, res) {
  let username = req.params.username;
  User.findOne({ username: username }, function(err, userBD) {
    if (err) {
      return res.json({
        succes: false,
        msj: 'No se ha encontrado ningún usuario',
        err
      });
    } else {
      // UserXcommentXreview.find({ user: userBD }, function(err, userXcommentXreview) {
      //   if (err) {
      //     return res.render('user.pug');
      //   } else {
      //     res.render('user.pug', {taulaConjunta: userXcommentXreview, username2: userBD.username, biography2: userBD.biography, profilePicture2: userBD.profilePicture});
      //   }
      // })
      res.render('user.pug', {username2: userBD.username, biography2: userBD.biography, profilePicture2: userBD.profilePicture})
    }
  })
});


router.post('/user/edit/params', UserController.edit);
router.post('/user/edit/img', function(req, res, next){
  const form = formidable({ });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    let filePath = files.profilePicture.filepath;
    var sess = req.session;
    let newName = sess.username;

    fs.rename(filePath,app.filesPath + newName + "." + files.profilePicture.mimetype.split("/")[1] , function(err) {
      if (err) throw err
      
      console.log('Succesfully');
    });
    User.findOneAndUpdate({username: sess.username}, {profilePicture: newName + "." + files.profilePicture.mimetype.split("/")[1]}, function(err, user) {
      user.save();
    });
    sess.profilePicture = newName + "." + files.profilePicture.mimetype.split("/")[1];
  });
  

  res.redirect('/user/edit');

});
module.exports = router;
/*
  /routes/index.js
*/
var User = require('../models/user.model');
const express = require('express');
const router = express.Router();
const path = require('path');
const session = require('express-session');
const formidable = require('formidable');
var fs = require('fs');
var app = require('../app.js');

//required of needed controllers
const UserController = require('../controllers/user.controller.js');
const authorController = require('../controllers/author.controller.js');
const bookController = require('../controllers/book.controller.js');
const genreController = require('../controllers/genre.controller.js');
const reviewController = require('../controllers/review.controller.js');
const userXcommentXreview = require('../controllers/userXcommentXreview.controller');


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
router.post('/book/list/queryByTitle',bookController.bookTitle);


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
  res.render('createReview.pug', {username: req.session.username});
});
router.post('/review/add/save',reviewController.save);
router.get('/review/list', reviewController.list);
router.get('/review/list', function(req,res){
  res.render('listOfReviews.pug', {username: req.session.username, listOfReviews: req.allReviewList});
});
  //one review passar la review de la bd i el llibre
router.get('/review/:idReview', reviewController.oneReview);
router.get('/review/:idReview', function(req,res){
  res.render('reviewPage.pug', {username: req.session.username, theReview: req.theReview, theBook: req.theBook});
});
  //comment part
router.post('/review/comment/new',userXcommentXreview.saveCommentMadeByUserInReview);



//Login
router.get('/user/signin',function(req,res){
  res.render('login.pug', {username: req.session.username, completeName: req.session.completeName, birthDate: req.session.birthDate, email: req.session.email})
});

//login and register form
router.post('/user/signin/save', UserController.login);
router.post('/user/signup/save', UserController.register);

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
    // let posPicture = picture[7] + "/" + picture[8] + "/" + newName + "." + files.profilePicture.mimetype.split("/")[1];
    // console.log(posPicture);
    console.log(app.filesPath);
    fs.rename(filePath, newName + "." + files.profilePicture.mimetype.split("/")[1] , function(err) {
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

//user page (comments remain to be done)
router.get('/user/profile/:username',reviewController.listMadeByUser);

module.exports = router;
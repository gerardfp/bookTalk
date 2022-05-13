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
const favouritesController = require('../controllers/favourites.controller');


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
router.get('/', reviewController.list);
router.get('/', genreController.list);
router.get('/',function(req,res){
  res.render('home.pug', {username: req.session.username, completeName: req.session.completeName, birthDate: req.session.birthDate, email: req.session.email, listOfReviews: req.allReviewList, listOfGenres: req.allGenreList})
});

router.get('/genre', function(req, res) {
  res.render('home.pug', {username: req.session.username, completeName: req.session.completeName, birthDate: req.session.birthDate, email: req.session.email, listOfReviews: req.allReviewList, listOfGenres: req.allGenreList})
})

//Register
router.get('/user/signup',function(req,res){
  res.render('register.pug', {errors0: req.session.errors0, errors1: req.session.errors1, errors2: req.session.errors2, errors3: req.session.errors3, errors4: req.session.errors4, username: req.session.username, completeName: req.session.completeName, birthDate: req.session.birthDate, email: req.session.email})
});

//book
router.get('/book/add',genreController.get);
router.get('/book/add',authorController.get);
router.get('/book/add',function(req,res){
  res.render('createBook.pug',{username: req.session.username, authorList: req.authors, genreList: req.genres});
});
router.post('/book/add/save',bookController.save);

//AQUESTA NO S'UTILITZA
router.get('/book/list/all',bookController.list);
router.get('/book/list/alll', function(req,res){
  res.render('listOfBooks.pug', {listOfBooks: req.allBooksList});
});

router.get('/book/:idBook',bookController.aBook);
router.get('/book/:idBook',reviewController.listMadeOfBook);
router.get('/book/:idBook', function(req,res){
  res.render('bookPage.pug', {theBook: req.booksFound, theReviews: req.allReviewList});
});

router.post('/book/list/query',bookController.filterList);
router.post('/book/list/queryByTitle',bookController.bookTitle);

//author
router.get('/author/add',function(req,res){
  res.render('createAuthor.pug', {username: req.session.username});
});
router.post('/author/add/save',authorController.save);
router.post('/author/search',authorController.get);


//genre
router.get('/genre/add',function(req,res){
  res.render('createGenre.pug', {username: req.session.username});
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
router.get('/review/:idReview',userXcommentXreview.getAllReviewComments);
router.get('/review/:idReview',genreController.list);
router.get('/review/:idReview', function(req,res){
  res.render('reviewPage.pug', {username: req.session.username, theReview: req.theReview, theBook: req.theBook, comments: req.commentsinReview,listOfGenres: req.allGenreList});
});

//comment part
router.post('/review/comment/new',userXcommentXreview.saveCommentMadeByUserInReview);
router.get('/review/like/:idReview',reviewController.likeIt);
router.get('/review/numberOflikes/:idReview',reviewController.numOfLikes);

router.get('/review/comment/like/:idCommentNode/:idComment',userXcommentXreview.likeAComment);

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

//User
//user page (comments remain to be done)
router.get('/user/:username',reviewController.listMadeByUser);
router.get('/user/:username',genreController.list);
router.get('/user/:username',userXcommentXreview.getAllUserComments);
router.get('/user/:username', function(req, res) {
  let username = req.params.username;
  User.model.findOne({ username: username }, function(err, userBD) {
    if (err) {
      return res.json({
        succes: false,
        msj: 'No se ha encontrado ningún usuario',
        err
      });
    } else {
      res.render('user.pug', {username: req.session.username, reviewsMadeByUser: req.reviewsMadeByUser, commentsMadeByUser: req.commentsMadeByUser, username2: userBD.username, biography2: userBD.biography, profilePicture2: userBD.profilePicture, listOfGenres:req.allGenreList})
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
    console.log(filePath);
    var sess = req.session;
    let newName = sess.username;

    let picture = sess.profilePicture.split("/");
    console.log(picture[2]);

    if (sess.profilePicture != null && sess.profilePicture != undefined && sess.profilePicture != "") {
      fs.unlinkSync(app.filesPath + picture[2]);
    }

    User.model.findOneAndUpdate({username: sess.username}, {profilePicture: ''}, function(err, user) {
      user.save();
    });

    fs.rename(filePath,app.filesPath + newName + "." + files.profilePicture.mimetype.split("/")[1] , function(err) {
      if (err) throw err
      console.log('Succesfully');
    });
    User.model.findOneAndUpdate({username: sess.username}, {profilePicture: newName + "." + files.profilePicture.mimetype.split("/")[1]}, function(err, user) {
      user.save();
    });

    req.session.profilePicture = "/public/" + newName + "." + files.profilePicture.mimetype.split("/")[1];

    console.log("AAAAA");
    console.log(sess.profilePicture);
    console.log("BBBBBBB");

    res.redirect('/user/edit');
  });
  


});
router.get('/user/getUsername/:userId',UserController.getUsernameForComments);


//searcher routes
router.post('/search/books',bookController.searchBooksForSearcher);
router.post('/search/users',UserController.searchUsersForSearcher);
router.post('/search/reviews',reviewController.searchReviewsForSearcher);
router.get('/searcher/test', function(req,res){
  res.render('searcherTest.pug');
});

router.post('/filter/byGenres',bookController.searchBooksForGenre);
router.get('/filter/byGenres/result', function(req,res){
  res.render('searchResult.pug',{booksFound: req.session.listOfBooks});
});


//Favoritos
router.get('/favorites', favouritesController.getFavouritesByUser);
router.get('/favorites', genreController.list);
router.get('/favorites', function(req,res){
  res.render('favoritos.pug', {username: req.session.username, listOfGenres: req.allGenreList, listFavouritesOfUser: req.listFavouritesOfUser});
});

router.get('/favorites/add/:idBook', favouritesController.addFavouriteOrRemove);

module.exports = router;
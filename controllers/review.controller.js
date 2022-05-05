var Review = require('../models/review.model.js');
var Book = require('../models/book.model.js');


exports.save = async (req, res, next) => {    
    let bookid = await Book.findOne({bookName: req.body.booktitle.toLowerCase()});
    let review = new Review.model({reviewTitle: req.body.reviewTitle.toLowerCase(), reviewScore: req.body.score , reviewText: req.body.review , bookImage: "", numberOfLikes: 0, bookId: bookid._id, username: req.session.username});
    console.log(review);
    review.save();
    res.redirect("/");
}

exports.listMadeByUser = async (req, res, next) => {
    let reviewsMadeByUser = await Review.model.find({ username: req.params.username });
    console.log(req.params.username);
    console.log(reviewsMadeByUser);
    //res.json(reviewsMadeByUser);
    req.reviewsMadeByUser = reviewsMadeByUser;
    next();
}

exports.list  = async (req, res, next) => {
    req.allReviewList = await Review.model.find();
    console.log(req.allReviewList);
    next();
}

exports.oneReview  = async (req, res, next) => {
    req.theReview = await Review.model.findOne({_id:req.params.idReview});
    req.theBook = await Book.findOne({ _id: req.theReview.bookId });
    console.log(req.theReview);
    console.log(req.theBook);
    next();
}
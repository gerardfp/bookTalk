var Review = require('../models/review.model.js');
var Book = require('../models/book.model.js');
var User = require('../models/user.model.js');


exports.save = async (req, res, next) => {
    let bookid = await Book.findOne({bookName: req.body.booktitle});
    let testSearchReview = await Review.model.findOne({bookId: bookid._id, username: req.body.username});
    if (testSearchReview == undefined) {
        let arrayLikes = new Array;
        let review = new Review.model({reviewTitle: req.body.reviewTitle.toLowerCase(), reviewScore: req.body.score , reviewText: req.body.review , bookImage: "", likes: arrayLikes, bookId: bookid._id, username: req.body.username});
        console.log(review);
        review.save();    
    }
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

exports.list = async (req, res, next) => {
    req.allReviewList = await Review.model.find();
    console.log(req.allReviewList);
    next();
}

exports.oneReview = async (req, res, next) => {
    req.theReview = await Review.model.findOne({_id:req.params.idReview});
    req.theBook = await Book.findOne({ _id: req.theReview.bookId });
    console.log(req.theReview);
    console.log(req.theBook);
    next();
}

exports.searchReviewsForSearcher = async (req, res, next) => {
    let userQuery = req.body.userInput;
    let reviewsFound = await Review.model.find({reviewTitle: new RegExp(userQuery)});
    res.json(reviewsFound);
    return;
}

exports.likeIt = async (req, res, next) => {
    let userWhoWantsToLikeit = await User.model.findOne({username: req.session.username});
    let reviewToLike = await Review.model.findOne({_id: req.params.idReview});

    let likeArray = reviewToLike.likes;
    console.log("AAAAAAAAAAA");
    console.log(userWhoWantsToLikeit);
    if (!likeArray.includes(userWhoWantsToLikeit) && userWhoWantsToLikeit != null) {
        console.log("Adeu");
        likeArray.push(userWhoWantsToLikeit);
        console.log(userWhoWantsToLikeit);
    } else if (likeArray.includes(userWhoWantsToLikeit) && userWhoWantsToLikeit != null) {
        console.log("Hola");
        let indexOfUser = likeArray.indexOf(userWhoWantsToLikeit);
        likeArray.splice(indexOfUser);
        await Review.model.updateOne({ _id: req.params.idReview }, { likes:likeArray });
    }
    res.redirect('back');
}


exports.numOfLikes = async (req, res, next) => {
    let review = await Review.model.findOne({_id: req.params.idReview});
    let numOflikes = review.likes.length;
    res.json({"number":numOflikes});
    return;
}
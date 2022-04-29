var Review = require('../models/review.model.js');
var Book = require('../models/book.model.js');


exports.save = async (req, res, next) => {
    let bookid = await Book.findOne({bookName: req.body.booktitle});
    console.log(req.body);
    let review = new Review({reviewTitle: req.body.reviewTitle.toLowerCase(), reviewScore: req.body.score , reviewText: req.body.review , bookImage: "", numberOfLikes: 0, bookId: bookid._id});
    console.log(review);
    review.save();
    res.redirect("/");
}
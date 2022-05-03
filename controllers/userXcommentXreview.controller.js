const Review = require('../models/review.model');
const Commentary = require('../models/commentary.model.js');
const User = require('../models/user.model');
const UserXcommentXreview = require('../models/userXcommentXreview.model');

exports.saveCommentMadeByUserInReview  = async (req, res, next) => {
    let userFinded = await User.model.findOne({ username: req.body.username });
    let reviewFinded = await Review.model.findOne({ _id: req.body.reviewId });

    let testSearch = await UserXcommentXreview.findOne({user: userFinded, review: reviewFinded});
    if (testSearch == undefined) {
        let commentsArray = new Array;
        let comment = new Commentary.model({commentText: req.body.comment, numOfLikes: 0, timeStamp: Date.now()});
        commentsArray.push(comment);
        let input = new UserXcommentXreview({user: userFinded, review: reviewFinded, comments:commentsArray});
        console.log(input);
        input.save();
    }
    res.redirect("/review/list");
}


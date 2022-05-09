const Review = require('../models/review.model');
const Commentary = require('../models/commentary.model.js');
const User = require('../models/user.model');
const UserXcommentXreview = require('../models/userXcommentXreview.model');

exports.saveCommentMadeByUserInReview  = async (req, res, next) => {
    let userFinded = await User.model.findOne({ username: req.body.username });
    let reviewFinded = await Review.model.findOne({ _id: req.body.reviewId });

    let testSearch = await UserXcommentXreview.model.findOne({userid: userFinded._id, reviewid: reviewFinded._id});

    if (testSearch == undefined) {
        let commentsArray = new Array;
        let comment = new Commentary.model({commentText: req.body.comment, likes: new Array, timeStamp: Date.now()});
        commentsArray.push(comment);
        let input = new UserXcommentXreview.model({userid: userFinded._id, reviewid: reviewFinded._id, comments:commentsArray});
        console.log(input);
        input.save();
    } else {
        let commentsArray = testSearch.comments;
        let comment = new Commentary.model({commentText: req.body.comment, likes: new Array, timeStamp: Date.now()});
        commentsArray.push(comment); 
        const res = await UserXcommentXreview.model.updateOne({ userid: userFinded._id, reviewid: reviewFinded._id }, { comments:commentsArray });
    }
    res.redirect('back');
}

exports.getAllUserComments  = async (req, res, next) => {
    //li pases el username per la ruta
    console.log(req.params.username);
    let userFinded = await User.model.findOne({ username: req.params.username });
    if (userFinded != undefined) {
        let listOfCommentedReviewsByUser = await UserXcommentXreview.model.find({userid : userFinded._id});
        let commentsMadeByUser = new Array;
        listOfCommentedReviewsByUser.forEach(element => {
            commentsMadeByUser.push(element.comments);
        });
        req.commentsMadeByUser = commentsMadeByUser;    
    }
    next();
}

exports.getAllReviewComments  = async (req, res, next) => {
    //li pases el username per la ruta
    console.log(req.params.idReview);
    let reviewFinded = await Review.model.findOne({ _id: req.params.idReview });
    if (reviewFinded != undefined) {
        let listOfCommentedReviewsByUser = await UserXcommentXreview.model.find({reviewid : reviewFinded._id});
        req.commentsinReview = listOfCommentedReviewsByUser;    
    }
    next();
}

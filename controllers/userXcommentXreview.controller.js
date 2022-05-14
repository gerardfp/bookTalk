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

exports.likeAComment  = async (req, res, next) => {
    //li pases el username per la ruta
    let idComentary = req.params.idComment;
    if (req.session.username != null) {
        let userWhoWantsToLikeit = await User.model.findOne({username: req.session.username});
        let node = await UserXcommentXreview.model.findOne({_id : req.params.idCommentNode});

        var comment = node.comments.filter(function(item) { return item._id == idComentary; });
        let commentsArray = node.comments;
        let username = userWhoWantsToLikeit.username;
        if (!comment[0].likes.includes(userWhoWantsToLikeit.username) && userWhoWantsToLikeit != null) {
            comment[0].likes.push(username);
            let previousPosition = commentsArray.indexOf(comment[0]);
            commentsArray.splice(commentsArray.indexOf(comment[0]),1);
            commentsArray.splice(previousPosition,0,comment[0]);
            await UserXcommentXreview.model.updateOne({ _id: req.params.idCommentNode }, { comments:commentsArray });
        } else if (comment[0].likes.includes(userWhoWantsToLikeit.username) && userWhoWantsToLikeit != null) {
            comment[0].likes.splice(comment[0].likes.indexOf(username));
            let previousPosition = commentsArray.indexOf(comment[0]);
            commentsArray.splice(commentsArray.indexOf(comment[0]),1);
            commentsArray.splice(previousPosition,0,comment[0]);
            await UserXcommentXreview.model.updateOne({ _id: req.params.idCommentNode }, { comments:commentsArray });
        }
    res.redirect('back');
    }
}

const app = require('../app')
const { fetchCommentsByReviewId, createReviewComment } = require ('../models/comments.model')

exports.getCommentsByReviewId = (req, res, next) => {
    const reviewId = req.params.review_id; 
    fetchCommentsByReviewId(reviewId).then((comments) => {
        res.status(200).send( { comments })
    }).catch(next)
}

exports.postCommentByReviewId = (req, res, next) => {
    const reviewId = req.params.review_id; 
    const postBody = req.body; 
    createReviewComment(reviewId, postBody).then((comment) => {
        const postedCommment = comment[0]
        res.status(201).send( {  body: postedCommment.body, username: postedCommment.author })
    })
    .catch(next)
}


const app = require('../app')
const { fetchCommentsByReviewId, checkExists } = require ('../models/comments.model')

exports.getCommentsByReviewId = (req, res, next) => {
    const reviewId = req.params.review_id; 
    fetchCommentsByReviewId(reviewId).then((comments) => {
        res.status(200).send( { comments })
    }).catch(next)
}


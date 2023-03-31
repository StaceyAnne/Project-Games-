const app = require('../app')
const { fetchCommentsByReviewId, createReviewComment, removeCommentById } = require ('../models/comments.model')

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
        res.status(201).send( {  comment })
    })
    .catch(next)
}

exports.deleteCommentById = (req, res, next) => {
   
    const { comment_id } = req.params; 

    return removeCommentById(comment_id).then(() => {
        res.status(204).send()
    })
    .catch(next)
    
}


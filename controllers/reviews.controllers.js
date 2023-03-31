const app = require('../app')

const { fetchReview, fetchAllReviews, updateVoteByReviewId } = require('../models/reviews.models')

exports.getReviewById = (req, res, next) => {
    const reviewId = req.params.review_id;
    fetchReview(reviewId)
    .then((review) => {
        res.status(200).send( { review })
    }).catch(next)
}

exports.getAllReviews = (req, res, next) => {
    fetchAllReviews().then((reviews) => {
        res.status(200).send( { reviews })
    }).catch(next)
}

exports.patchReviewVote = (req, res, next) => {
    const reviewId = req.params.review_id; 
    const newVote = req.body.inc_votes; 
  
    updateVoteByReviewId(reviewId, newVote).then((review) => {
        res.status(200).send({ review })
    }).catch(next)
}


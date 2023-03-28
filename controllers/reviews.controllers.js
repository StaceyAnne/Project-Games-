const app = require('../app')

const { fetchReview } = require('../models/reviews.models')

exports.getReview = (req, res, next) => {
    const reviewId = req.params.review_id;
    fetchReview(reviewId)
    .then((review) => {
        res.status(200).send( { review })
    }).catch(next)
}


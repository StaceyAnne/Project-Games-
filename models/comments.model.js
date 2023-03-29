const db = require('../db/connection')
const { fetchReview } =  require('./reviews.models')



exports.fetchCommentsByReviewId = (reviewId) => {
    if (!Number(reviewId)) {
        return Promise.reject({ status: 400, msg: "Invalid review id"})
    }
 
    const queryString = 

    `SELECT 
    comments.*
    FROM reviews 
    INNER JOIN comments 
    ON comments.review_id = reviews.review_id 
    WHERE reviews.review_id = $1
    ORDER BY created_at DESC;`

    return db.query(queryString, [reviewId])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return fetchReview(reviewId).then(() => {
                return rows; 
            })
        }
        return rows; 
    })
}


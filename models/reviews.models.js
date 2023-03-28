const db = require('../db/connection')

exports.fetchReview = (reviewId) => {
   
    if (!Number(reviewId)) {
        return Promise.reject({ status: 400, msg: "Invalid request"})
    }
    const queryString = 'SELECT * FROM reviews WHERE review_id = $1;'
    
    return db.query(queryString, [reviewId])
    .then((review) => {
        if (review.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Id does not exist'})
        }
        const { rows } = review; 
        return rows[0]; 
    })
}
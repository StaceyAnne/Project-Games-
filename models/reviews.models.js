const db = require('../db/connection')

exports.fetchReview = (reviewId) => {
   
    if (!Number(reviewId)) {
        return Promise.reject({ status: 400, msg: "Invalid review id"})
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


exports.fetchAllReviews = () => {
    return db.query(
        `SELECT 
        reviews.title, 
        reviews.category, 
        reviews.designer, 
        reviews.owner, 
        reviews.review_img_url, 
        reviews.created_at, 
        reviews.votes, 
        reviews.review_id,
        CAST(COUNT(comment_id) AS INT) AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at DESC;`)
    .then(({ rows }) => {
        return rows; 
    })
}

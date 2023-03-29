const db = require('../db/connection')


const checkExists = (id) => {
    return db.query(
        `SELECT * FROM reviews WHERE review_id = $1;`, [id]
    ).then((result) => {
    if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: 'Id does not exist'})
    }   
})
}

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
            return checkExists(reviewId).then(() => {
                return rows; 
            })
        }
        return rows; 
    })
}


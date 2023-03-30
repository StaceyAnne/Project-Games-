const db = require('../db/connection')
const { fetchReview } =  require('./reviews.models')
const format = require('pg-format')


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


exports.createReviewComment = (reviewId, postBody) =>  {
    const { body, username } = postBody; 
    if (!Number(reviewId)) {
        return Promise.reject({ status: 400, msg: "Invalid review id"})
    }
    const postLength = Object.keys(postBody).length; 

    if (postBody.hasOwnProperty('username' && 'body') === false || postLength !== 2) {
        return Promise.reject({ status: 400, msg: "Invalid input"})
    }

    
    const queryString =
        `INSERT INTO comments
         (body, author,review_id) 
         VALUES ($1, $2, $3) 
         RETURNING *;`
    

    return fetchReview(reviewId).then((result) => { 
     
      return db.query(queryString, [body, username, reviewId]).then((body) => {
        return body.rows[0]; 
    })

})

}

exports.updateVoteByReviewId = (reviewId, patchBody) => {
    const { body, username } = postBody; 
    const vote = postBody.inc_votes; 
    if (!Number(reviewId)) {
        return Promise.reject({ status: 400, msg: 'Invalid review id'})
    }

    return fetchReview((reviewId)).then((result) => {
        if (!result) {
            return Promise.reject({ status: 404, msg: 'no id'})
        }
        
    const queryString = `update reviews set votes = votes + $1 where review_id = $2 RETURNING*`; 

    return fetchReview(reviewId).then((result) => {
        return db.query(queryString, [vote, reviewId])
    }).then((review)=> {
        return review.body; 
    } )
    })

}

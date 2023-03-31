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

exports.removeCommentById = (commentId) => {
    if (!Number(commentId)) {
        return Promise.reject({ status: 400, msg: "Invalid comment id"})
    }
  
    const queryString = `DELETE FROM comments WHERE comment_id = $1 RETURNING*;`
    return db.query(queryString, [commentId]).then((body) => {
  
        if (body.rowCount === 0) {
          
            return Promise.reject( { status: 404, msg: "Id does not exist"})
        }
      return body.rows; 
    })

}



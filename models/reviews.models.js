const db = require('../db/connection')

const fetchReviews = exports.fetchReview = (reviewId) => {
    
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





exports.fetchAllReviews = (categoryId, sortOrder) => {
    
    if (categoryId && 
        categoryId !== 'social-deduction' &&
        categoryId !== 'hidden-roles' &&
        categoryId !== 'deck-building' &&
        categoryId !== "strategy" &&
        categoryId !== "engine-building" &&
        categoryId !== "dexterity" && 
        categoryId !== 'roll-and-write' &&
        categoryId !== 'push-your-luck' && 
        categoryId !== 'euro game' &&
        categoryId !== 'social deduction'
        
        ) {
           
            return Promise.reject({ status:400, msg: "Invalid category"})
        }

    if (sortOrder && sortOrder !== 'desc' && sortOrder !== 'asc') {
        return Promise.reject({ status:400, msg: "Invalid sort input"})
    }

    let categoryString = '';
        
        if (categoryId) {
            categoryString += `HAVING category = '${categoryId}'`
        }

const order = sortOrder || 'DESC'; 


const queryString =  `SELECT 
reviews.title, 
reviews.category, 
reviews.designer, 
reviews.owner, 
reviews.review_img_url, 
reviews.created_at, 
reviews.votes, 
reviews.review_id,
CAST(COUNT(comment_id) AS INT) AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ${categoryString} ORDER BY reviews.created_at ${order};`

return db.query(queryString)
    .then((result) => {
        const reviews = result.rows; 
        
        return reviews; 
    })
}




exports.updateVoteByReviewId = (reviewId, newVote) => {

    const queryString = `update reviews set votes = votes + $1 where review_id = $2 RETURNING*;`

    return fetchReviews(reviewId).then((result) => {
       return db.query(queryString, [newVote, reviewId])
    }).then((result)=> {
        const review = result.rows[0]
        return review; 
    })
    

}

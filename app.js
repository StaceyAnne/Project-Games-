const { getCategories } = require('./controllers/categories.controller')


const { getCommentsByReviewId, postCommentByReviewId, deleteCommentById } = require("./controllers/comments.controller")

const { getReviewById, getAllReviews, patchReviewVote } = require('./controllers/reviews.controllers')



const express = require('express')
const app = express(); 

app.use(express.json())
app.get('/api/categories', getCategories)
app.get('/api/reviews/:review_id', getReviewById)
app.get('/api/reviews', getAllReviews)
app.get('/api/reviews/:review_id/comments', getCommentsByReviewId)
app.post('/api/reviews/:review_id/comments', postCommentByReviewId)
app.delete('/api/comments/:comment_id', deleteCommentById)
app.patch('/api/reviews/:review_id', patchReviewVote)


app.all('*', (req, res, next) => {


    res.status(404).send({ msg: "Incorrect file path"})
    next(err)
})

//custom errors
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg }) 
    }
    next(err)
})

//psql errors
app.use((err, req, res, next) => {
    if (err.code === '23502') {
        res.status(400).send( { msg: "Invalid input"})
    }
    next(err)
})

//500 error
app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal server error"})
})






module.exports = app; 
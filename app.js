const { getCategories } = require('./controllers/categories.controller')
const { getReviewById, getAllReviews } = require('./controllers/reviews.controllers')
const { getCommentsByReviewId } = require("./controllers/comments.controller")
const express = require('express')

const app = express(); 
app.get('/api/categories', getCategories)
app.get('/api/reviews/:review_id', getReviewById)
app.get('/api/reviews', getAllReviews)
app.get('/api/reviews/:review_id/comments', getCommentsByReviewId)

app.all('/*', (req, res, next) => {
    res.status(404).send({ msg: "Incorrect file path"})
    next()
})

app.use((err, req, res, next) => {
    res.status(err.status).send({ msg: err.msg })   
})






module.exports = app; 
const { getCategories } = require('./controllers/categories.controller')
const { getReviewById, getAllReviews } = require('./controllers/reviews.controllers')
const express = require('express')

const app = express(); 
app.get('/api/categories', getCategories)
app.get('/api/reviews/:review_id', getReviewById)
app.get('/api/reviews', getAllReviews)


app.all('/*', (req, res, next) => {
    res.status(404).send({ msg: "Incorrect file path"})
    next()
})

app.use((err, req, res, next) => {
    res.status(err.status).send({ msg: err.msg })
})




module.exports = app; 
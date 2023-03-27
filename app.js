const { getCategories } = require('./controllers/categories.controller')
const express = require('express')

const app = express(); 
app.get('/api/categories', getCategories)


app.all('*', (req, res, next) => {
    res.status(404).send({ msg: "Incorrect file path"})
})


module.exports = app; 
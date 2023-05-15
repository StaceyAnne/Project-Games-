const { fetchEndPoints } = require('../models/api.model')
exports.getEndPoints = (req, res, next) => {
    fetchEndPoints().then((response) => {
        res.send(response)
    }).catch(next)
}; 
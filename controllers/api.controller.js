const { fetchEndPoints } = require('../models/api.model')
exports.getEndPoints = (req, res, next) => {
  fetchEndPoints().then((response) => {
        res.status(200).send(response)
    }).catch(next)
}; 
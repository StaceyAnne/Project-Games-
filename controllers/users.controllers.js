const { fetchUsers } = require('../models/users.models');


exports.getUsers = (req,res,next) => {
    return fetchUsers().then(({ rows }) => {
        res.status(200).send( { rows })
    }).catch(next)
}
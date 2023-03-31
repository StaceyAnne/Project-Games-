const db = require('../db/connection')

exports.fetchUsers = () => {
    const queryString = `SELECT * FROM users;`
   return db.query(queryString).then((users) => {
    return users; 
})
}
const fs = require('fs/promises')

exports.fetchEndPoints =  async () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, 'utf8', (err, response) => {
            return response; 
    })
}
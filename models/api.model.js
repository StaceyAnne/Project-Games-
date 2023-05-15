const fs = require('fs')
exports.fetchEndPoints = () => {
    fs.readFile(`${__dirname}/endpoints.json`, 'utf8', (err, response) => {
        if (err) {
            return err; 
        }

        else {
            return response; 
        }
    })
}
const jwt = require('jsonwebtoken');

module.exports = {
    login_ver: function(token) {
        // This function is used to help ver login
        return jwt.verify(token, 'secret_key', (err, decoded) => {
            if(err) {
              console.log(err);
              return -1;
            } else {
              console.log(decoded.id);
              return decoded.id;
            }
        });
    }
};
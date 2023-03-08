const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = {
    login_ver: function(token) {
        // This function is used to help ver login
        jwt.verify(token, 'secretkey', (err, authData) => {
            if(err) {
              return -1;
            } else {
              return authData.id;
            }
        });
    }
};
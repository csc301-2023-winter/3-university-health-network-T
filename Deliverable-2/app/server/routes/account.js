const express = require('express');
const router = express.Router();
const pg = require('pg');
const jwt = require('jsonwebtoken');
const { pool } = require('../dbConfig');
// fake user data, since we have linked to database, this is not needed.
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

router.get('/login', (req, res) => {
  return res.send({ message: 'Login page' });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  let count = 0; // this count is used to check if the user exists in the database.
  pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password])
    .then(result => {
      console.log(result.rows);
      count = result.rows.length // update count with the actual number of returned rows
      if (count === 0) {
         return res.status(401).send({ message: 'Invalid username or password' });
      } else {
         const user = result.rows[0];
         return res.send({message: 'Login successful',  
                          token: jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '24h' })});
      }
   })
  .catch(error => {
     console.log(error);
     return res.status(500).send({ message: 'Error querying the database' });
  });
});

router.get('/signup', (req, res) => {
  return res.send({ message: 'Signup page' });
});

router.post('/signup', (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required' });
    }
    let error_flag = false;
    // const existingUser = pool.query('SELECT * FROM users WHERE email = $1', [email]);
    // if (existingUser.rows.length > 0) {
    //   return res.status(409).send({ message: 'Email already exists' });
    // }
    pool.query('Select * from users where email = $1', [email])
    .then(result => {
      console.log(result.rows);
      if (result.rows.length > 0) {
        error_flag = true;
      };
    });
    if (error_flag) {
      return res.status(409).send({ message: 'Email already exists' });
    }
    const newUser = pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id', [email, password]);
    return res.status(201).send({ message: 'Signup successful' });
  });

module.exports = router;
const express = require('express');
const router = express.Router();
const pg = require('pg');
const jwt = require('jsonwebtoken');
const { pool } = require('../dbConfig');

router.get('/signin', (req, res) => {
  return res.send({ message: 'Login page' });
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  let count = 0; // this count is used to check if the user exists in the database.
  pool.query('SELECT * FROM Patient WHERE Email = $1 AND Password = $2', [email, password])
    .then(result => {
      console.log(result.rows);
      count = result.rows.length // update count with the actual number of returned rows
      if (count === 0) {
         return res.status(401).send({ message: 'Invalid username or password' });
      } else {
         const patient = result.rows[0];
         console.log(patient.patientid);
         return res.send({message: 'Login successful',  
                          email: email,
                          token: jwt.sign({ id: patient.patientid }, 'secret_key', { expiresIn: '24h' })});
      }
   })
  .catch(error => {
     console.log(error);
     return res.status(500).json({ message: 'Error querying the database' });
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
    pool.query('Select * from Patient where Email = $1', [email])
    .then(result => {
      console.log(result.rows);
      if (result.rows.length > 0) {
        error_flag = true;
      };
      if (error_flag) {
        return res.status(409).json({ message: 'Email already exists' });
      } else {
        const newUser = pool.query('INSERT INTO Patient (Email, Password) VALUES ($1, $2)', [email, password]);
        return res.status(201).json({ message: 'Signup successful' });
      }
    });
  });

module.exports = router;
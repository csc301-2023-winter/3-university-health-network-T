const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');

router.post('/', (req, res) => {
    const { name, email, message } = req.body;
    pool.query('INSERT INTO Contact (name, email, message) VALUES ($1, $2, $3)', [name, email, message]);
    return res.status(200).send({ message: 'Received your feedback successfully!' });
})

module.exports = router;
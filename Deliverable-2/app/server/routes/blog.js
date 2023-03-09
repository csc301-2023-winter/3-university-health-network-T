const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');

router.get('/detail/:bid', (req, res) => {
  const bid = req.params.bid;

  pool.query('SELECT * FROM Blog WHERE bid = $1', [bid], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    if (result.rows.length === 0) {
      res.status(404).send({ message: 'Blog not found' });
      return;
    }

    res.status(200).json({
      message: 'Retrieved blog successfully',
      data: result.rows[0]
    });
  });
});

router.get('/blogs/:page', (req, res) => {
  const page = req.params.page;
  const limit = 10;
  const offset = (page - 1) * limit;

  pool.query('SELECT * FROM Blog ORDER BY bid LIMIT $1 OFFSET $2', [limit, offset], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.status(200).json({
      message: 'Retrieved blogs successfully',
      data: result.rows
    });
  });
});

module.exports = router;
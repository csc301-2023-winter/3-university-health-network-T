const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');

router.get('/', (req, res) => {
    const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
    if (pid < 0) {
        return res.status(403).send({ message: 'Invalid credentials' });
    }
    pool.query('SELECT * FROM Help')
    .then((helpdata) => {
        const dataList = helpdata.rows.map((row) => ({
            question: row.question,
            answer: row.answer
        }));
        return res.status(200).json({ message: 'Retrive All Help Info Successfully', help: dataList });
    }).catch((error) => {
        console.log(error);
        return res.status(500).send({ message: 'Occur errors when getting relevant data' });
    })
})

module.exports = router;
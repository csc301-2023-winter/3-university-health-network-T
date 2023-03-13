const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');
const exes_helper = require('../tools/pre_comp_exes');

router.get('/getexes-todo', (req, res) => {
    const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
    console.log(pid);
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }
    exes_helper.exe_todo(pid).then((result) => {
        console.log(result);
        res.status(200).json({
            message: "Retrieved exercises successfully",
            data: result
        });
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send(err);
        return;
    });
})

router.get('/avatar-for-exe', (req, res) => {
    const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
    console.log(pid);
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }

    const exercise = req.query.exercise;
    const character = req.query.character;
    var resdata = { exercise: exercise, character: character };

    pool.connect((err, client, done) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        client.query('SELECT Format, Path FROM Avatar WHERE Exercise = $1 AND character = $2', [exercise, character], (err, result) => {
            done();

            if (err) {
                res.status(500).send(err);
                return;
            }

            const avatarData = result.rows[0];
            resdata.format = avatarData.format;
            resdata.path = avatarData.path;

            res.status(200).json({
                message: "Get Info Successfully",
                data: resdata
            });
        });
    });
});


router.post('/complete_exercise', (req, res) => {
    // TODO: need to ask
});

module.exports = router;

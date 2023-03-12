const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');
const exes_helper = require('../tools/per_comp_exes');

router.get('/get-comp-exes', (req, res) => {
    const pid = ver_tools.login_ver(req.token);
  
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }

    result = exes_helper.get_all_compe(pid);
    
    if (result === -1) {
        res.status(500).send("error: Failed to get exercise");
        return;
    }
    
    res.status(200).json({
        message: 'Retrieved exercises successfully',
        data: result
    });
});

router.get('/getexes-todo', (req, res) => {
    const pid = ver_tools.login_ver(req.token);
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }
    const result = exes_helper.exe_todo(pid);
    if (result === -1) {
        res.status(500).send("error: Failed to get exercise");
        return;
    }
    res.status(200).json({
        message: "Retrieved exercises successfully",
        data: result
    });
    return;
})

router.get('/avatar-for-exe', (req, res) => {
    const pid = ver_tools.login_ver(req.token);
  
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }

    const exercise = req.body.exercise;
    const character = req.body.character;
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
            resdata.format = avatarData.Format;
            resdata.path = avatarData.Path;

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

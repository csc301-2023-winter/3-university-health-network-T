const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');
const exes_helper = require('../tools/pre_comp_exes');
const avatarHelper = require('../tools/avatarHelper');

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
});

router.get('/avatar-for-exe', async (req, res) => {
    const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
    console.log(pid);
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }
    const exercise = req.query.exercise;
    const character = req.query.character;
    const avatarUrl = await avatarHelper.getAvatarUrl(exercise, character);
    if (!avatarUrl) {
      return res.status(404).send('Avatar not found');
    }
    res.send({ avatarUrl });
});


// router.get('/avatar-for-exe', (req, res) => {
//     const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
//     console.log(pid);
//     if (pid < 0) {
//         res.sendStatus(403);
//         return;
//     }

//     const exercise = req.query.exercise;
//     const character = req.query.character;
//     pool.query('SELECT Path, Format FROM Avatar WHERE Exercise = $1 AND Character = $2', [exercise, character], (err, result) => {
//         if (err) {
//         console.error(err);
//         return res.status(500).send(err);
//         }
//         const avatar = result.rows[0];
//         getAvatarURL(exercise, character, avatar.Format).then((url) => {
//         return res.status(200).send({ url });
//         }).catch((error) => {
//             console.error(error);
//             return res.status(500).send(error);
//         });
//     });
// });


router.post('/complete_exercise', (req, res) => {
    // TODO: need to ask
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');
const exes_helper = require('../tools/pre_comp_exes');

router.get('/year', (req, res) => {
    const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
    console.log(pid);
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }
    exes_helper.get_all_compe(pid).then((result1) => {
        exes_helper.getAllMeetings(pid).then((result2) => {
            console.log(result1);
            console.log(result2);
            const exercises = [];
            const meetings = [];
            const both = [];

            for (const date in result1) {
                exercises.push(new Date(date).toDateString());
            }
            for (const date in result2) {
                meetings.push(new Date(date).toDateString());
            }
            for (const date of exercises) {
                if (meetings.includes(date)) {
                    both.push(date);
                }
            }
            res.status(200).json({
                message:"Success",
                data:{
                    exercises: exercises,
                    meetings:meetings,
                    both:both
                }
            })
        }).catch(err => {
            console.error(err);
            res.status(500).send(err);
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});


// router.get('/day', (req, res) => {

// });
module.exports = router;
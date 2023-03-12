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
            const exercises = new Set();
            const meetings = new Set();
            const both = new Set();

            for (const exercise of result1) {
                const date = exercise.date;
                if (!result2.has(date)) {
                    exercises.add(date);
                } else {
                    both.add(date);
                }
            }

            for (const meeting of result2) {
                const date = meeting.date;
                if (!result1.has(date)) {
                    meetings.add(date);
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

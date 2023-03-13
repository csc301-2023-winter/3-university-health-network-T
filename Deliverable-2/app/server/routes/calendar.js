const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');
const exes_helper = require('../tools/pre_comp_exes');
const moment = require('moment');

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
                const formattedDate = new Date(date).toISOString().slice(0,10);
                exercises.push(formattedDate);
            }
            for (const date in result2) {
                const formattedDate = new Date(date).toISOString().slice(0,10);
                meetings.push(formattedDate);
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


router.get('/day', (req, res) => {
    const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
    console.log(pid);
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }
    exes_helper.get_all_compe(pid).then((result1) => {
        exes_helper.getAllMeetings(pid).then((result2) => {
            const output = {};
            for (const date in result1) {
            const formattedDate = moment(date, 'M/D/YYYY').format('YYYY-MM-DD');
            if (!output[formattedDate]) {
                output[formattedDate] = {};
            }
            if (!output[formattedDate].exercises) {
                output[formattedDate].exercises = [];
            }
            result1[date].forEach((exercise) => {
                output[formattedDate].exercises.push({
                exercise: exercise.exercise,
                number_sets: exercise.number_sets,
                number_repetitions: exercise.number_repetitions
                });
            });
            }
            for (const date in result2) {
            const formattedDate = moment(new Date(date)).format('YYYY-MM-DD');
            if (!output[formattedDate]) {
                output[formattedDate] = {};
            }
            if (!output[formattedDate].meetings) {
                output[formattedDate].meetings = [];
            }
            result2[date].forEach((meeting) => {
                output[formattedDate].meetings.push({
                meetingid: meeting.meetingid,
                starttime: meeting.starttime,
                endtime: meeting.endtime
                });
            });
            }
            console.log(output);

            res.status(200).json({
                message:"Success",
                data:output
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
module.exports = router;
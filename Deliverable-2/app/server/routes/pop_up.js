const express = require('express');
const router = express.Router();
const pg = require('pg');
const { pool } = require('../dbConfig');

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// below post method is for testing purposes only. It will add some information to the database.

router.get('/popup', async (req, res) => {
    try {
        const { userId } = req.body;
        //form the date data in the format YYYY-MM-DD
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
        const day = ('0' + currentDate.getDate()).slice(-2);
        const dateString = year + '-' + month + '-' + day;
        // get the weekday
        const weekdayIndex = currentDate.getDay();
        const weekday = weekdays[weekdayIndex];

        const prescribedExercisesQuery = pool.query('select * from PrescribedExercise where userId = $1 and day_of_week = $2', [userId, weekday]);
        const meetingsQuery = pool.query('SELECT * FROM Meeting WHERE userId = $1 AND date >= NOW()', [userId]);

        const [prescribedExercisesResult, meetingsResult] = await Promise.all([prescribedExercisesQuery, meetingsQuery]);

        const exercisesList = prescribedExercisesResult.rows.map((row) => ({
            exercise: row.exercise,
            number_sets: row.number_sets,
            number_repetitions: row.number_repetitions,
            day_of_week: row.day_of_week
        }));

        const meetingList = meetingsResult.rows.map((row) => ({
            date: row.date,
            time: row.time,
            meetingId: row.meetingId
        }));

        console.log(exercisesList);
        console.log(meetingList);

        return res.status(200).send({ date: dateString, exercise: exercisesList, meeting: meetingList[0] });
    } catch (err) {
        console.log(err);
        return res.status(500).send('An error occured while trying to get exercise or meeting information');
    }
});

module.exports = router;
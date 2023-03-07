const express = require('express');
const router = express.Router();
const pg = require('pg');

// below is the connection to the database. Currently we set the connection to local database
const pool = new pg.Pool({
    user: 'lewis',
    host: 'localhost',
    database: 'lewis',
    password: '',
    port: 5432,
    // ssl: true // when we connect to cloud, activate the ssl connection.
});

router.post('/popup', (req, res) => {
    const query = `
    CREATE TABLE IF NOT EXISTS PrescribedExercise(
        userId INTEGER,
        exercise text,
        character text,
        number_sets INTEGER,
        number_repetitions INTEGER,
        day_of_week text
    )`;
    pool.query(query).then(
        () => {
            console.log('create this query successfully');
        }).catch((err) => console.log(err));
    const { userId, exercise, character, number_sets, number_repetitions, day_of_week, date, time, meetingId, meetingPasscode } = req.body;
    pool.query('INSERT INTO PrescribedExercise (userId, exercise, character, number_sets, number_repetitions, day_of_week) VALUES ($1, $2, $3, $4) RETURNING id', [userId, exercise, character, number_sets, number_repetitions, day_of_week])
    .then((result) => {
        console.log(result);
        console.log('create this query successfully');
    }).catch((err) => console.log(err));
    const meetingquery = `
    CREATE TABLE IF NOT EXISTS Meeting(
        userId INTEGER,
        date text NOT NULL,
        time text NOT NULL,
        meetingId INTEGER,
        meetingPasscode text
    )`;
    pool.query(meetingquery).then(
        () => {
            console.log('create meeting table successfully');
        }
    ).catch((err) => console.log(err));
    pool.query('INSERT INTO Meeting (userId, date, time, meetingId, meetingPasscode) VALUES ($1, $2, $3, $4, $5) RETURNING id', [userId, date, time, meetingId, meetingPasscode])
    .then((result) => {
        console.log(result);
        console.log('create meeting query successfully');
    }).catch((err) => console.log(err));
    return res.send('Add patient info successfully');
});

router.get('/popup', async (req, res) => {
    try {
        const { userId } = req.body;

        const prescribedExercisesQuery = pool.query('select * from PrescribedExercise where userId = $1', [userId]);
        const meetingsQuery = pool.query('select * from Meeting where userId = $1', [userId]);

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

        return res.status(200).send({ exercise: exercisesList, meeting: meetingList });
    } catch (err) {
        console.log(err);
        return res.status(500).send('An error occured while trying to get exercise or meeting information');
    }
});

module.exports = router;
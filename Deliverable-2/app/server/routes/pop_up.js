const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');
const exes_helper = require('../tools/pre_comp_exes');
// below post method is for testing purposes only. It will add some information to the database.

router.get('/popup', (req, res) => {
    const pid = ver_tools.login_ver(req.token);
  
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }
    const etodo = exes_helper.exe_todo(pid);
    if (etodo === -1) {
        res.status(500).send("error: Failed to get exercise");
        return;
    }
    try {
        const query = `SELECT Date, StartTime, EndTime, MeetingID, MeetingPasscode
                    FROM Meeting
                    WHERE PatinetID = $1 AND Date + StartTime > NOW()
                    ORDER BY Date + StartTime
                    LIMIT 1`;
        const result = pool.querySync(query, [patientId]);
    } catch (error) {
        console.error(error);
        res.status(500).send(err);
        return;
    }
    const meeting = result.rows[0];
    res.status(200).json({
        message: "Get Info Successfully",
        data: {
            exercises: etodo,
            upcoming_m: meeting
        }
    });
});

// router.get('/popup', async (req, res) => {
//     try {
//         const pid = ver_tools.login_ver(req.token);
//         //form the date data in the format YYYY-MM-DD
//         const currentDate = new Date();
//         const year = currentDate.getFullYear();
//         const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
//         const day = ('0' + currentDate.getDate()).slice(-2);
//         const dateString = year + '-' + month + '-' + day;
//         // get the weekday
//         const weekdayIndex = currentDate.getDay();
//         const weekday = weekdays[weekdayIndex];

//         const prescribedExercisesQuery = pool.query('select * from PrescribedExercise where PatientID = $1', [pid]);
//         const meetingsQuery = pool.query('SELECT * FROM Meeting WHERE PatientID = $1', [pid]);

//         const [prescribedExercisesResult, meetingsResult] = await Promise.all([prescribedExercisesQuery, meetingsQuery]);

//         const exercisesList = prescribedExercisesResult.rows.map((row) => ({
//             exercise: row.Exercise,
//             number_sets: row.Number_Sets,
//             number_repetitions: row.Number_Repetitions,
//             day_of_week: row.Day_Of_Week
//         }));

//         const meetingList = meetingsResult.rows.map((row) => ({
//             date: row.Date,
//             start_time: row.StartTime,
//             end_time: row.EndTime,
//             meetingId: row.MeetingID,
//             meetingPassword: row.MeetingPassword,
//             meetingLink: `https://meeting-service.communication.azure.com/?id=${row.MeetingID}`
//         }));

//         console.log(exercisesList);
//         console.log(meetingList);

//         return res.status(200).send({ date: dateString, weekday: weekday, exercise: exercisesList, meeting: meetingList });
//     } catch (err) {
//         console.log(err);
//         return res.status(500).send('An error occured while trying to get exercise or meeting information');
//     }
// });

module.exports = router;
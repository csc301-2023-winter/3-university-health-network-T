const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');
const exes_helper = require('../tools/pre_comp_exes');
// below post method is for testing purposes only. It will add some information to the database.

router.get('/popup', (req, res) => {
    
    const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
    console.log(pid);
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }
    exes_helper.exe_todo(pid)
    .then((result) => {
        console.log(result);
        const etodo = result;
    
    if (etodo === -1) {
        res.sendstatus(500).send("error: Failed to get exercise");
        return;
    }
    try {
        const query = `SELECT Date, StartTime, EndTime, MeetingID, MeetingPasscode
                    FROM Meeting
                    WHERE PatientID = $1 AND Date + StartTime > NOW()
                    ORDER BY Date + StartTime
                    LIMIT 1`;
        pool.query(query, [pid], (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).send(error);
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
        } catch (error) {
        console.error(error);
        res.status(500).send(error);
        return;
    }

    })
    .catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});

module.exports = router;
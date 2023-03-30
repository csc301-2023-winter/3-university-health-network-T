// Import required modules
const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');
const exes_helper = require('../tools/pre_comp_exes');

// This route handles the '/popup' endpoint, which retrieves exercise and meeting information for a patient.
router.get('/popup', (req, res) => {
    
    // Verify the patient's login and extract the patient ID
    const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
    console.log(pid);
    
    // If the patient ID is invalid, return a 403 Forbidden status
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }

    // Get the exercise to-do list for the patient
    exes_helper.exe_todo(pid)
    .then((result) => {
        console.log(result);
        const etodo = result;
    
        // If there is an issue with the exercise to-do list, return a 500 Internal Server Error status
        if (etodo === -1) {
            res.sendstatus(500).send("error: Failed to get exercise");
            return;
        }
        
        // Query the database to get the next meeting for the patient
        try {
            const query = `SELECT Date, StartTime, EndTime, MeetingID, MeetingPasscode
                        FROM Meeting
                        WHERE PatientID = $1 AND Date + StartTime > NOW()
                        ORDER BY Date + StartTime
                        LIMIT 1`;
            pool.query(query, [pid], (error, result) => {
                // If there is a database error, log the error and return a 500 Internal Server Error status
                if (error) {
                    console.error(error);
                    res.status(500).send(error);
                    return;
                }
                
                // Extract the meeting information and return it along with the exercise to-do list
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
            // If there is an error in the try block, log the error and return a 500 Internal Server Error status
            console.error(error);
            res.status(500).send(error);
            return;
        }
    })
    .catch(err => {
        // If there is an error in the Promise chain, log the error and return a 500 Internal Server Error status
        console.error(err);
        res.status(500).send(err);
    });
});

// Export the router to be used by the main application
module.exports = router;

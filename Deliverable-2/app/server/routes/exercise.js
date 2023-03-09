const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');

router.get('/get-all-exes', (req, res) => {
    const pid = ver_tools.login_ver(req.token);
  
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }
    pool.query('SELECT Exercise, Character, Number_Sets, Number_Repetitions, Day_Of_Week FROM PrescribedExercise WHERE PatientID = $1', [pid], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
    
        const data = {};
        result.rows.forEach(row => {
            const key = `(${row.Exercise},${row.Day_Of_Week})`;
            if (!data[key]) {
                data[key] = {
                    Characters: [row.Character],
                    Number_Sets: row.Number_Sets,
                    Number_Repetitions: row.Number_Repetitions
            };
            } else {
                data[key].Characters.push(row.Character);
            }
        });
    
        res.status(200).json({
            message: 'Retrieved exercises successfully',
            data: data
        });
      });
});

router.get('/getexes-by-dow', (req, res) => {
    const pid = ver_tools.login_ver(req.token);
  
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }

    const dow = req.body.Day_Of_Week;
    pool.query('SELECT Exercise, Character, Number_Sets, Number_Repetitions FROM PrescribedExercise WHERE PatientID = $1 AND Day_Of_Week = $2', [pid, dow], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
    
        const data = {};
        result.rows.forEach(row => {
            if (!data[row.Exercise]) {
                data[row.Exercise] = {
                Characters: [row.Character],
                Number_Sets: row.Number_Sets,
                Number_Repetitions: row.Number_Repetitions
                };
            } else {
                data[row.Exercise].Characters.push(row.Character);
            }
        });
    
        res.status(200).json({
            message: 'Retrieved exercises successfully',
            data: data
        });
    });
})

router.get('/avatar-for-exes', (req, res) => {
    const pid = ver_tools.login_ver(req.token);
  
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }

    const exercise = req.body.exercise;
    const character = req.body.character;
    const dow = new Date().getDay();
    var resdata = { exercise: exercise, character: character };

    pool.connect((err, client, done) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        client.query('SELECT Number_Sets, Number_Repetitions FROM PrescribedExercise WHERE PatinetID = $1 AND Exercise = $2 AND Day_Of_Week = $3', [pid, exercise, dow], (err, result) => {
            done();

            if (err) {
                res.status(500).send(err);
                return;
            }

            const exerciseData = result.rows[0];
            resdata.no_sets = exerciseData.Number_Sets;
            resdata.no_repetitions = exerciseData.Number_Repet;

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
});

router.post('/complete_exercise', (req, res) => {
    // TODO: need to ask
});

module.exports = router;

const express = require('express');
const axios = require('axios');
const router = express.Router();
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');
const exes_helper = require('../tools/pre_comp_exes');
const avatarHelper = require('../tools/avatarHelper');

router.get('/getexes-todo', async (req, res) => {
    const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
    console.log(pid);
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }
    const charactersByExercise = await avatarHelper.get_characters_by_exercise();
    
    exes_helper.exe_todo(pid).then((result) => {
        console.log(result[0]);
        for (let i = 0; i < result.length; i++) {
            let chs = charactersByExercise[result[i].exercise];
            if (typeof chs !== 'undefined') {
                result[i].characters = chs;
            } 
        }
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

router.post('/complete_exercise', (req, res) => {
    const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
    console.log(pid);
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }
    const { exercise, character, date, time, number_sets, number_repetitions } = req.body;

    const query = `INSERT INTO CompletedExercise(PatientID, Exercise, Character, Number_Sets, Number_Repetitions, Date, Time)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    pool.query(query, [pid, exercise, character, number_sets, number_repetitions, date, date+' '+time], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error inserting data into CompletedExercise table.");
        }
        return res.status(200).send("Data inserted successfully into CompletedExercise table.");
    });
});
router.get('/avatar_provider',(req,res)=>{
    //const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
    //console.log(pid);
    //if (pid < 0) {
      //  res.sendStatus(403);
        //return;
    //}
    const exercise = req.query.exercise
    const character = req.query.character
    const query = `SELECT Path FROM Avatar WHERE Exercise = $1 AND Character = $2`;
    pool.query(query, [exercise, character],(err,result)=>{
        if (result.rows.length === 0) {
            res.sendStatus(404)
            return;
        }
        ex  = result.rows[0].path
        try {
            axios.get(ex, { responseType: 'arraybuffer' })
            .then((response)=>response.data).then(data=>{
                res.setHeader('Content-Type', 'model/gltf+json');
                res.setHeader('Content-Disposition', 'attachment; filename=file.gltf');
                res.send(data);
                return
            });
            
          } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return
          }
        

    });
    

})
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

module.exports = router;

const express = require('express');
const router = express.Router();
const pg = require('pg');
const jwt = require('jsonwebtoken');
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');
const Characters = ['']


router.get('/exercise', async (req, res) => {
    const pid = ver_tools.login_ver(req.token)
    
    if (pid < 0) {
        res.sendStatus(403);
    }
    const exercise = req.params.exercise
    const character = req.params.character
    const dow = new Date().getDay();
    var resdata = {exercise: exercise, character: character}
    try {
        const exerciseData = await db.one('SELECT Number_Sets, Number_Repetitions FROM PrescribedExercise WHERE PatinetID = $1 AND Exercise = $2 AND Day_Of_Week = $3', [pid, exercise, dow])
        resdata[no_sets] = exerciseData.Number_Sets;
        resdata[no_repetitions] = exerciseData.Number_Repet;
    } catch (err) {
        res.status(500).send(error);
    }
    try {
        const avatarData = await db.one('SELECT Format, Path FROM Avatar WHERE Exercise = $1 AND character = $2', [exercise, character]);
        resdata[format] = avatarData.Format;
        resdata[path] = avatarData.Path;
      } catch (error) {
        res.status(500).send(error);
    }
    res.status(200).json({
        message:"get info successfully", 
        data: resdata
    });
});
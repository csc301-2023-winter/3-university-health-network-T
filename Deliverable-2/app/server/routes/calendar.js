const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');
const exes_helper = require('../tools/pre_comp_exes');

router.get('/calendar/year', (req, res) => {
    const pid = ver_tools.login_ver(req.token);
  
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }

    result = exes_helper.get_all_compe(pid);
    
    if (result === -1) {
        res.status(500).send("error: Failed to get exercise");
        return;
    }
    
    res.status(200).json({
        message: 'Retrieved exercises successfully',
        data: result
    });
});

const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');

router.get('/get-all-meetings', (req, res) => {
  const pid = ver_tools.login_ver(req.token);
  if (pid < 0) {
    return res.status(403).send({ message: 'Invalid credentials' });
  }
  pool.query('SELECT Date, StartTime, EndTime, MeetingID, MeetingPasscode FROM Meeting WHERE PatientID = $1', [pid])
  .then((meetingsResult) => {
      const meetingList = meetingsResult.rows.map((row) => ({
        date: row.Date,
        startTime: row.StartTime,
        Endtime: row.EndTime,
        meetingId: row.MeetingID,
        meetingPasscode: row.MeetingPasscode
      }));
      console.log(meetingsList);
      return res.status(200).json({ message: 'Retrive All Meeting Info Successfully', meeting: meetingList });
  }).catch((err) => {
    console.log(err);
    return res.status(500).send({ message: 'Occur errors when getting relevant data' });
  });
});

router.get('/get-upcoming-meetings', (req, res) => {
  const pid = ver_tools.login_ver(req.token);
  if (pid < 0){
    return res.status(403).send({ message: 'Invalid credentials' });
  }
  pool.query('SELECT Date, StartTime, EndTime, MeetingID, MeetingPasscode FROM Meeting WHERE PatientID = $1 ORDER BY Date DESC, StartTime DESC LIMIT 1', [pid])
  .then((meetingResult) => {
    const meeting = meetingResult.rows.map((row) => ({
      date: row.Date,
      startTime: row.StartTime,
      endTime: row.EndTime,
      meetingId: row.MeetingID,
      meetingPasscode: row.MeetingPasscode
    }));
    console.log(meeting);
    return res.status(200).json({ message: 'Retrive Meeting Info Successfully', meeting: meeting });
  }).catch((err) => {
    console.log(err);
    return res.status(500).send({ message: 'Occur errors when getting relevant data' });
  });
});


module.exports = router;
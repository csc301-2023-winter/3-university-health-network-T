const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');
const { RoomsClient }= require('@azure/communication-rooms');
const { CommunicationIdentityClient } = require("@azure/communication-identity");
const connectionString = "endpoint=https://d2-test2.communication.azure.com/;accesskey=F7dNPDSMnHEHpXzLcAFTgxuMbyAvT4tx+NXsu2xLC1+qMvzrnpCunof/l91kyAz2Gqb4rfB9j4iVtbNAdMcc7Q==";
const roomsClient = new RoomsClient(connectionString);
const identityClient = new CommunicationIdentityClient(connectionString);
const { v4: uuidv4 } = require('uuid');

const URLheader = "https://uhnmeet.azurewebsites.net/?groupId=";

function uuidToBigInt(uuid) {
  const hexString = uuid.replace(/-/g, ''); // Remove dashes from UUID
  return BigInt(`0x${hexString}`); // Convert hex string to BigInt
}


router.post('/createMeeting', async (req, res) => {
  const { patientid, date, starttime, endtime } = req.body;
  const meetingId = uuidv4();
  const meetingUrl = `${URLheader}${meetingId}`;

  try {
      // Verify patientid in the patient database
      const patientInfo = await pool.query(`SELECT * FROM Patient WHERE PatientID=$1`, [patientid]);

      if (patientInfo.rowCount === 0) {
          return res.status(400).json({ message: 'Patient not found.' });
      }

      // Verify if a meeting already exists with the same starttime for the patient
      const meetingInfo = await pool.query(`SELECT * FROM Meeting WHERE PatientID=$1 AND Date=$2 AND StartTime=$3::time`, [patientid, date, starttime]);

      if (meetingInfo.rowCount > 0) {
          return res.status(400).json({ message: 'A meeting already exists at the specified start time.' });
      }

      // Insert the new meeting into the Meeting database
      await pool.query(`
          INSERT INTO Meeting (PatientID, Date, StartTime, EndTime, MeetingID, MeetingPasscode)
          VALUES ($1, $2, $3::time, $4::time, $5, $6)
      `, [patientid, date, starttime, endtime, uuidToBigInt(meetingId), meetingUrl]);

      res.status(201).json({ meetingUrl });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while creating the meeting.' });
  }
});

router.get('/:meetingid', async (req, res) => {
  const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
  console.log(pid);

  // If the patient ID is invalid, return a 403 Forbidden status
  if (pid < 0) {
      res.sendStatus(403);
      return;
  }

  const meetingid = req.params.meetingid;

  try {
      // Get the meeting information from the database
      const meetingInfo = await pool.query(`SELECT * FROM Meeting WHERE MeetingID=$1`, [meetingid]);

      if (meetingInfo.rowCount === 0) {
          return res.status(404).json({ message: 'Meeting not found.' });
      }

      const meeting = meetingInfo.rows[0];
      const currentTime = new Date();
      const startTime = new Date(meeting.date + 'T' + meeting.starttime);
      const endTime = new Date(meeting.date + 'T' + meeting.endtime);

      // Check if the current time is within the start and end times of the meeting
      if (currentTime >= startTime && currentTime <= endTime) {
          const meetingUrl = meeting.meetingpasscode;
          res.status(200).json({ meetingUrl });
      } else {
          res.status(204).json({ message: `Start time will be ${startTime}` });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while retrieving the meeting.' });
  }
});


module.exports = router;



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

const schedule = require('node-schedule');
const port = process.env.PORT || 4000;
const yourDomain = "localhost:${port}";

// Function to create a new meeting room
async function createMeetingRoom(patientId, startTime) {
    // Create a new user identity
    const user = await identityClient.createUser();
    
    // Create a new meeting room
    const meeting = await roomsClient.create({
        displayName: `Meeting for patient ${patientId}`,
        participants: [
            {
                identity: user
            }
        ]
    });

    // Generate the URL for the meeting room
    const meetingUrl = `https://${yourDomain}/rooms/${meeting.id}`;

    return {
        meetingId: meeting.id,
        meetingUrl: meetingUrl
    };
}

// Endpoint to create and schedule a meeting room
router.post('/createMeeting', async (req, res) => {
    const { patientId, startTime } = req.body;

    try {
        // Query the database to get the meeting's information
        const meetingInfo = await pool.query(`SELECT * FROM meeting WHERE "PatinetID"=$1 AND "StartTime"=$2`, [patientId, startTime]);
        
        // Check if a meeting already exists at the specified start time
        if (meetingInfo.rowCount > 0) {
            return res.status(400).json({ message: 'A meeting already exists at the specified start time.' });
        }

        // Create a new meeting room and get its URL
        const { meetingId, meetingUrl } = await createMeetingRoom(patientId, startTime);

        // Schedule the room to start at the specified start time
        const scheduledJob = schedule.scheduleJob(startTime, async () => {
            await roomsClient.start(meetingId);
        });

        // Save the new meeting information to the database
        await pool.query(`INSERT INTO meeting ("PatinetID", "Date", "StartTime", "EndTime", "MeetingID", "MeetingPasscode") VALUES ($1, $2, $3, $4, $5, $6)`, [patientId, new Date(startTime), startTime, endTime, meetingId, uuidv4()]);

        res.status(201).json({ meetingUrl });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the meeting room.' });
    }
});

module.exports = router;

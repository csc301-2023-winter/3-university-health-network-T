const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');
const { RoomsClient }= require('@azure/communication-rooms');
const { CommunicationIdentityClient } = require("@azure/communication-identity");
const connectionString = "endpoint=https://meeting-service.communication.azure.com/;accesskey=sIb5y7vrxfo8M6fdkE03yCb5GGcj0BkUnDMv5VwoAsZXze3jY5iO3hNMkVPEI3XDBFshp9sHF9plE+2DiTgzgA==";
const roomsClient = new RoomsClient(connectionString);

router.get('/get-all-meetings', (req, res) => {
  const pid = ver_tools.login_ver(req.token);
  if (pid < 0) {
    return res.status(403).send({ message: 'Invalid credentials' });
  }
  pool.query('SELECT Date, StartTime, EndTime, MeetingID, MeetingPasscode FROM Meeting WHERE PatientID = $1', [pid])
  .then((meetingsResult) => {
      const meetingList = meetingsResult.rows.map((row) => ({
        date: row.date,
        startTime: row.starttime,
        Endtime: row.endtime,
        meetingId: row.meetingId,
        meetingPasscode: row.meetingpasscode
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
      date: row.date,
      startTime: row.starttime,
      endTime: row.endtime,
      meetingId: row.meetingid,
      meetingPasscode: row.meetingpasscode
    }));
    console.log(meeting);
    return res.status(200).json({ message: 'Retrive Meeting Info Successfully', meeting: meeting });
  }).catch((err) => {
    console.log(err);
    return res.status(500).send({ message: 'Occur errors when getting relevant data' });
  });
});

async function createRoom(){
  // initialize a room client.
  const identityClient = new CommunicationIdentityClient(connectionString);
  const user1 = await identityClient.createUserAndToken(["voip"]);
  const user2 = await identityClient.createUserAndToken(["voip"]);

  var validFrom = new Date(Date.now());
  var validUntil = new Date(validFrom.getTime() + 5 * 60 * 1000);

  //create a room 
  const createRoomOptions = {
    validFrom: validFrom,
    validUntil: validUntil,
    roomJoinPolicy: "InviteOnly",
    participants: [
      {
        id: user1.user,
        role: "Attendee",
      },
    ]
  };
  //create a room with this payload.
  const createRoom = await roomsClient.createRoom(createRoomOptions);
  const roomId = createRoom.id;
  console.log('create room');
  
  await roomsClient.getRoom(roomId);
  console.log(`Retrieved Room with ID ${roomId}`);
}

router.get('/meeting-room', (req, res) => {
  const pid = ver_tools.login_ver(req.token);
  if (pid < 0){
    return res.status(403).send({ message: 'Invalid credentials' });
  }
  createRoom();
  return res.send('create room');
});

module.exports = router;
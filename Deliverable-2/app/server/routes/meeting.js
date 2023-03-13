const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');
const { RoomsClient }= require('@azure/communication-rooms');
const { CommunicationIdentityClient } = require("@azure/communication-identity");
const connectionString = "endpoint=https://meeting-service.communication.azure.com/;accesskey=sIb5y7vrxfo8M6fdkE03yCb5GGcj0BkUnDMv5VwoAsZXze3jY5iO3hNMkVPEI3XDBFshp9sHF9plE+2DiTgzgA==";
const roomsClient = new RoomsClient(connectionString);
const identityClient = new CommunicationIdentityClient(connectionString);

router.get('/get-all-meetings', (req, res) => {
  const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
  if (pid < 0) {
    return res.status(403).send({ message: 'Invalid credentials' });
  }
  pool.query('SELECT Date, StartTime, EndTime, MeetingID, MeetingPasscode FROM Meeting WHERE PatientID = $1', [pid])
  .then((meetingsResult) => {
      const meetingList = meetingsResult.rows.map((row) => ({
        date: row.date,
        startTime: row.starttime,
        Endtime: row.endtime,
        meetingId: row.meetingid,
        meetingPasscode: row.meetingpasscode
      }));
      return res.status(200).json({ message: 'Retrive All Meeting Info Successfully', meeting: meetingList });
  }).catch((err) => {
    console.log(err);
    return res.status(500).send({ message: 'Occur errors when getting relevant data' });
  });
});

router.get('/get-upcoming-meetings', (req, res) => {
  const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
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
  const user1 = await identityClient.createUserAndToken(["voip"]);
  const user2 = await identityClient.createUserAndToken(["voip"]);

  var validFrom = new Date(Date.now());
  validFrom.setHours(validFrom.getHours() + 1);
  var validUntil = new Date(validFrom.getTime() + 30 * 60 * 1000);

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
  
  const getRoom = await roomsClient.getRoom(roomId);
  console.log(`Retrieved Room with ID ${roomId}`);
  const double = [getRoom, user1.token];
  return Promise.resolve(double);
}

router.get('/meeting-room', (req, res) => {
  const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
  if (pid < 0){
    return res.status(403).send({ message: 'Invalid credentials' });
  }
  createRoom().then(([getRoom, token]) => {
    const year = getRoom.validFrom.getFullYear();
    const month = getRoom.validFrom.getMonth() + 1;
    const day = getRoom.validFrom.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const startTimeHour = String(getRoom.validFrom.getHours()).padStart(2, '0');
    const startTimeMinute = String(getRoom.validFrom.getMinutes()).padStart(2, '0');
    const startTime = `${startTimeHour}:${startTimeMinute}`;
    const endTimeHour = String(getRoom.validUntil.getHours()).padStart(2, '0');
    const endTimeMinute = String(getRoom.validUntil.getMinutes()).padStart(2, '0');
    const endTime = `${endTimeHour}:${endTimeMinute}`;
    pool.query('INSERT INTO Meeting (PatientID, Date, StartTime, EndTime, MeetingID, MeetingPasscode) VALUES ($1, $2, $3, $4, $5, $6)', [pid, formattedDate, startTime, endTime, getRoom.id, '25001200']);
    return res.status(200).send({ message: 'Created room successfully', roomId: getRoom.id, meetingToken : token});
  }).catch((err) => {
    console.log(err);
    return res.status(403).send({ message: 'There is a error in creating room' });
  });
});

module.exports = router;
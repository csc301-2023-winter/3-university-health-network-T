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
  const user1Id = user1.user.communicationUserId;


  var validFrom = new Date(Date.now() - 100 * 60 * 1000);
  validFrom.setHours(validFrom.getHours() + 1);
  var validUntil = new Date(validFrom.getTime() + 60 * 60 * 10000);
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
  const double = [getRoom, user1.token, user1.user.communicationUserId]; // Add user1Id to the returned array
  return Promise.resolve(double);
}

router.get('/meeting-room', (req, res) => {
  const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
  if (pid < 0){
    return res.status(403).send({ message: 'Invalid credentials' });
  }
  createRoom().then(([getRoom, token, communicationUserId]) => {
    console.log('getRoom:', getRoom); // Debug output
    console.log('token:', token); // Debug output
    console.log('communicationUserId:', communicationUserId); // Debug output
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
    return res.status(200).send({ message: 'Created room successfully', roomId: getRoom.id, meetingToken: token, communicationUserId: communicationUserId });

  }).catch((err) => {
    console.log(err);
    return res.status(403).send({ message: 'There is a error in creating room' });
  });
});


async function createUserToken(){
  let identityResponse = await identityClient.createUser();
  console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`);
  // Issue an access token with a validity of 24 hours and the "voip" scope for an identity
  let tokenResponse = await identityClient.getToken(identityResponse, ["voip"]);

  // Get the token and its expiration date from the response
  const { token, expiresOn } = tokenResponse;
  console.log(`\nIssued an access token with 'voip' scope that expires at ${expiresOn}:`);
  console.log(token);
  return token;
}

router.get('/meeting-user-token', (req, res) => {
  const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
  if (pid < 0){
    return res.status(403).send({ message: 'Invalid credentials' });
  }
  createUserToken().then(([token]) => {
    console.log(token);
    return res.status(200).send({ message: "successfully", token: token });
  });
});

router.get('/create-group', (req, res) => {
  const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
  if (pid < 0){
    return res.status(403).send({ message: 'Invalid credentials' });
  }
  const { date, startTime, endTime } = req.body;
  const groupId = uuidv4();
  pool.query('INSERT INTO Meeting (PatientID, Date, StartTime, EndTime, MeetingID, MeetingPasscode) VALUES ($1, $2, $3, $4, $5, $6)', [pid, date, startTime, endTime, groupId, '25001200']);
  res.status(200).send({ message: `Create room successfully, Meeting will start at ${date}, ${startTime} - ${endTime}`, groupId: groupId });
})
module.exports = router;


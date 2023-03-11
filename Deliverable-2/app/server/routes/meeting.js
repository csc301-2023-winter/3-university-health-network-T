const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const ver_tools = require('../tools/verifiers');
const CommunicationIdentityClient = require("@azure/communication-administration").CommunicationIdentityClient;
const {
  AzureCommunicationTokenCredential,
  CommunicationRelayClient,
  CommunicationUserIdentifier
} = require("@azure/communication-network-traversal");
const { CommunicationIdentityCredential } = require('@azure/communication-common');
const endpointUrl = "https://<endpoint_url>.communication.azure.com";
const apiKey = "<api_key>";
const communicationRelayClient = new CommunicationRelayClient(endpointUrl, new AzureCommunicationTokenCredential(apiKey));

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

async function createRoom(meetingId, meetingPassword) {
  try {
    const communicationIdentityClient = new CommunicationIdentityClient(apiKey);
    const userResponse = await communicationIdentityClient.createUserAndToken(["voip"]);
    const id = userResponse.user.communicationUserId;
    const token = userResponse.token;

    const credential = new CommunicationIdentityCredential(token);
    const meetingDetails = {};
    meetingDetails.isBroadcast = true;
    meetingDetails.subject = `Patient Meeting`;
    meetingDetails.startDateTimeUtc = new Date().toISOString();
    meetingDetails.expirationDateTimeUtc = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    meetingDetails.attendees = [{ communicationUserId: id }];
    meetingDetails.participants = [{ userId: "patient", displayName: "Patient" }];
    if(meetingPassword){
      meetingDetails.policies = { lobbyBypassSettings: { scope: "organization", isDialInBypassEnabled: false },[password]: {scope: 'tenant', type: 'numericPassword', value: password}}
    }
    const meetingInfo = await communicationRelayClient.createMeeting({
      meetingId: meetingId,
      options: meetingDetails,
      alternateEndpoint: undefined,
      communicationUser: new CommunicationUserIdentifier(id),
      accessToken: await credential.getToken(["voip"])
    });
    const joinLink = `https://${meetingInfo.links.communicationRelay.href}`;

    return joinLink;
  } catch (e) {
    console.error(`Failed to create meeting room: ${e}`);
    throw e;
  }
} 

router.get('meeting-room', (req, res) => {
  const pid = ver_tools.login_ver(req.token);
  if (pid < 0){
    return res.status(403).send({ message: 'Invalid credentials' });
  }
  const { meetingId, meetingPassword } = req.body;
  const link = createRoom(meetingId, meetingPassword);
  return res.status(200).send({ meetingLink : link });
});

module.exports = router;
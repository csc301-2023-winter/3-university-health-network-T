import React, { useEffect, useState } from 'react';
import {
  CallComposite,
  CallAdapter,
  createAzureCommunicationCallAdapter,
} from '@azure/communication-react';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

const OneToOneMeeting = () => {
  const [callAdapter, setCallAdapter] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [meetingToken, setMeetingToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/meeting/meeting-room', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('Response data:', data);
      setRoomId(data.roomId);
      setMeetingToken(data.meetingToken);
      localStorage.setItem('communicationUserId', data.communicationUserId); // Store communicationUserId in local storage
      localStorage.setItem("meetingToken", data.meetingToken);
      console.log('Response Meeting1:', data.communicationUserId);
      return data;
    };
  
    const initAdapter = async (data) => {
      if (data.meetingToken) {
        console.log('Creating call adapter with meetingToken:', data.meetingToken, 'and roomId:', data.roomId);
        try {
          const userId = localStorage.getItem('communicationUserId');
          const meeting_token = localStorage.getItem("meetingToken");
          console.log("UserId:", userId)
          const adapter = await createAzureCommunicationCallAdapter({
            userId: { communicationUserId: userId }, // replace 'your_user_id' with a valid user ID
            displayName: 'Lalala', // replace 'your_display_name' with a valid display name
            credential: new AzureCommunicationTokenCredential(meeting_token),
            locator: { groupId: data.roomId },
          });
          setCallAdapter(adapter);
        } catch (error) {
          console.error('Failed to create call adapter', error);
        }
      }
    };
  
    fetchData()
      .then(data => initAdapter(data))
      .catch(error => console.error('Error fetching data', error));
  
  }, []);
  
  

  


  return (
    <div>
      {callAdapter ? (
        <CallComposite adapter={callAdapter} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default OneToOneMeeting;







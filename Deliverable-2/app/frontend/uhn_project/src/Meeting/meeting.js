import React, { useEffect, useState } from 'react';
import { server_url } from '../global';
//import {
  //CallComposite,
  //CallAdapter,
  //createAzureCommunicationCallAdapter,
//} from '@azure/communication-react';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

/**
 * OneToOneMeeting is a React functional component that sets up a one-to-one meeting using Azure Communication Services.
 * 
 * It initializes the state variables 'callAdapter', 'roomId', and 'meetingToken' using the useState hook. The 'callAdapter' 
 * state variable holds an AzureCommunicationCallAdapter object that is used to connect to the meeting. The 'roomId' and 'meetingToken' 
 * state variables hold the room ID and meeting token fetched from the server.
 * 
 * The useEffect hook is used to fetch the meeting information from the backend server using an HTTP GET request to 
 * 'http://localhost:5000/meeting/meeting-room'. The request requires a JWT token in the Authorization header. When the data 
 * is fetched, it is stored in the 'roomId' and 'meetingToken' state variables.
 * 
 * The 'initAdapter' function is called to initialize the 'callAdapter' state variable. It checks if a meeting token is available 
 * and creates an AzureCommunicationCallAdapter object using the createAzureCommunicationCallAdapter function from the Azure 
 * Communication Services library. The createAzureCommunicationCallAdapter function takes the user ID, display name, credential, 
 * and locator as parameters. The user ID and display name are obtained from the localStorage object. The credential is an instance 
 * of AzureCommunicationTokenCredential initialized with the meeting token obtained earlier. The locator is an object that specifies 
 * the 'roomId'.
 * 
 * The component returns a div element that conditionally renders either the CallComposite component, if the callAdapter is not null, 
 * or a "Loading..." message otherwise.
 */


const OneToOneMeeting = () => {
  const [callAdapter, setCallAdapter] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [meetingToken, setMeetingToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${server_url}/meeting/meeting-room`, {
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
          const adapter =NaN//= await createAzureCommunicationCallAdapter({
            //userId: { communicationUserId: userId }, // replace 'your_user_id' with a valid user ID
            //displayName: 'Lalala', // replace 'your_display_name' with a valid display name
            //credential: new AzureCommunicationTokenCredential(meeting_token),
            //locator: { groupId: data.roomId },
          //});
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
      {//<CallComposite adapter={callAdapter} />
        }
      {callAdapter ? (
        
        <div> aaa</div>

      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default OneToOneMeeting;







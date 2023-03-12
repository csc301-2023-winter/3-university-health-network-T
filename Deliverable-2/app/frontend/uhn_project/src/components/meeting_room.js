import { CommunicationIdentityClient } from '@azure/communication-identity';
import { CommunicationUserKind } from '@azure/communication-common';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { MeetingDetails, MeetingParticipant } from '@azure/communication-calling';
import { CallClient, CallAgent } from '@azure/communication-calling';
import { Component } from 'react';
class Meeting_room extends Component{
    async getMeetingUrl() {
        // 1. Create an instance of CommunicationIdentityClient
        const communicationIdentityClient = new CommunicationIdentityClient('<connection string>');
      
        // 2. Create a new user
        const { communicationUser: user } = await communicationIdentityClient.createUser({ kind: CommunicationUserKind.CommunicationUser });
      
        // 3. Create a token for the user
        const { token } = await communicationIdentityClient.issueToken(user, ['voip']);
      
        // 4. Create an instance of AzureCommunicationTokenCredential
        const tokenCredential = new AzureCommunicationTokenCredential(token);
      
        // 5. Create an instance of CallClient
        const callClient = new CallClient();
      
        // 6. Create an instance of CallAgent
        const callAgent = await callClient.createCallAgent(tokenCredential);
      
        // 7. Get the meeting details for the given meeting ID
        const meetingDetails = await callAgent.getMeetingDetails(props.meetingId);
      
        // 8. Get the meeting URL
        const meetingUrl = meetingDetails.joinUrl;
      
        this.setState({['meetingUrl']:meetingUrl})
      }
      render(){
        
      }
}


// Call the function with the meeting ID
const meetingId = '<your-meeting-id>';
const meetingUrl = await getMeetingUrl(meetingId);
console.log(meetingUrl); // The URL of the meeting


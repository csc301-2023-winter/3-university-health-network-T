import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CallClient, LocalVideoStream, Renderer, RemoteParticipant } from '@azure/communication-calling';



import { Component } from 'react';
import { server_url } from '../global';
import { useParams } from 'react-router';

class Meeting_room extends Component{
    
    constructor(props){
        super(props)
        this.state={
            credential:NaN
        }
    }
    componentDidMount() {
        const connectionString = 'endpoint=https://d2-test2.communication.azure.com/;accesskey=F7dNPDSMnHEHpXzLcAFTgxuMbyAvT4tx+NXsu2xLC1+qMvzrnpCunof/l91kyAz2Gqb4rfB9j4iVtbNAdMcc7Q==';
        const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOmU3NDhiNmFiLTRiZTgtNDdjYi1hMGRkLTI5ZDcyNGI3YjM4ZF8wMDAwMDAxNy03NzA1LWRmMjItMGNmOS05YzNhMGQwMDY3MmUiLCJzY3AiOjE3OTIsImNzaSI6IjE2Nzg2NDY3MjEiLCJleHAiOjE2Nzg3MzMxMjEsInJnbiI6ImNhIiwiYWNzU2NvcGUiOiJ2b2lwIiwicmVzb3VyY2VJZCI6ImU3NDhiNmFiLTRiZTgtNDdjYi1hMGRkLTI5ZDcyNGI3YjM4ZCIsInJlc291cmNlTG9jYXRpb24iOiJjYW5hZGEiLCJpYXQiOjE2Nzg2NDY3MjF9.o83bYTNTxnZQ07zhAmHuiBLVAcruecjdcqfCIm0BUoW6nZnNIqgT8ZwjHmlHtpStRT5sibgrx2CZEpzteiosEXhYl_KCuq1qQnEKiJwgGDZlQpnVYpQ_XCvO7hDt72vdIjWBF0VOqEwGYL3cvPjWpUXRZZjamLx2r1n9pwj3cO2KhqOfapZLFH5Ygd-OuOx02BHk6VvC8wvXa0NvdcB4l2DrQyZU68eENoVOiZ7oBhYWKgX6ZzbhRrWvXO6pJJYHLkvBbdgA2QKjhTlknL9zzX8Yv2li4C8Ncc2asFUw01TQuPbbaizWSrvzbQ_7pPH18NKj4l7dcLp0HlM1g_q8Kw';
        const userCredential = new AzureCommunicationTokenCredential(token);
        const callClient = new CallClient();
        callClient.createCallAgent(userCredential)
        callClient.initialize({ baseEndpoint: connectionString });
        this.setState({ callClient, userCredential });
    }
    async joinMeeting(meetingUrl) {
        const { callClient, userCredential } = this.state;
        const callOptions = { videoOptions: { localVideoStreams: [new LocalVideoStream(this.localVideoStreamElement)] } };
        const meetingToken = meetingUrl.substring(meetingUrl.lastIndexOf('/') + 1);
        const call = await callClient.join({ meetingToken }, callOptions, { credential: userCredential });
        call.on('remoteParticipantsUpdated', e => {
            e.added.forEach(p => this.addParticipant(p));
            e.removed.forEach(p => this.removeParticipant(p));
        });
    }
    
    /**
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
      **/
      render(){
        return (
        <div>
            <video ref={ref => this.localVideoStreamElement = ref} autoPlay={true} muted={true} />
            <div ref={ref => this.remoteParticipantsContainerElement = ref}></div>
            <button onClick={() => this.joinMeeting('https://uhn-meeting.azurewebsites.net/?groupId=4289f430-c113-11ed-b3d9-fb127a76869c')}>Join Meeting</button>
        </div>
          );
      }
}


export function Meeting_room_with_rotter(){
    let c=useParams()
    return(
        <Meeting_room meetingId={c.Id} />
    )
  }

import { CommunicationIdentityClient } from '@azure/communication-identity';
import { CommunicationUserKind } from '@azure/communication-common';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { MeetingDetails, MeetingParticipant } from '@azure/communication-calling';
import { CallClient, CallAgent } from '@azure/communication-calling';
import { Component } from 'react';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
import { MeetingComposite } from '@azure/communication-react';

class Meeting_room extends Component{
    
    constructor(props){
        super(props)
        this.state={
            credential:NaN
        }
    }
    componentDidMount(){
        this.setState({["credential"]:new AzureCommunicationUserCredential(this.props.userToken)})
    }
    componentDidUpdate(prevProps){
        if(this.props.userToken!=prevProps.userToken){
            this.setState({["credential"]:new AzureCommunicationUserCredential(this.props.userToken)})
        }
    }

    get_credential(){
        const myHeaders = new Headers();
        const token = localStorage.getItem("token");
        myHeaders.append("Authorization", `Bearer ${token}`);
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            
        };
        
        fetch(server_url+ "/meeting/room?room_id="+this.prop.meetingId,requestOptions)
        .then(reponse=>reponse.json).then(
            data=>{
                console.log(data.message)
                return data.data
            }
        ).then((data)=>{
            this.setState({["credential"]:new AzureCommunicationUserCredential(data.userToken)})
        })
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
              <MeetingComposite 
                credential={this.state.credential}
                meetingLink={`https://meeting-service.communication.azure.com/?id=${this.props.meetingId}`}
              />
            </div>
          );
      }
}


export function Meeting_room_with_rotter(){
    let c=useParams()
    return(
        <Meeting_room meetingId={c.Id}/>
    )
  }

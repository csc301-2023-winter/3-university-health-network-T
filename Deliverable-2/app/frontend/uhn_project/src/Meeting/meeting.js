import React, { useState, useEffect, useRef } from 'react';
import { CallClient, CallAgent, LocalVideoStream } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { VideoGallery, GridLayout } from '@azure/communication-react';

const VideoMeeting = () => {
  const [callAgent, setCallAgent] = useState(null);
  const [call, setCall] = useState(null);
  const [localVideoStream, setLocalVideoStream] = useState(null);

  const userToken = 'YOUR_USER_ACCESS_TOKEN'; // Replace with your user access token
  const groupId = 'YOUR_GROUP_ID'; // Replace with your group ID

  const callClient = useRef(new CallClient());

  useEffect(() => {
    async function initCallAgent() {
      const tokenCredential = new AzureCommunicationTokenCredential(userToken);
      const callAgent = await callClient.current.createCallAgent(tokenCredential);
      setCallAgent(callAgent);
    }

    initCallAgent();
  }, []);

  useEffect(() => {
    if (callAgent) {
      async function startCall() {
        const localVideoStream = new LocalVideoStream();
        setLocalVideoStream(localVideoStream);

        const call = callAgent.join({ groupId }, { videoOptions: { localVideoStreams: [localVideoStream] } });
        setCall(call);
      }

      startCall();
    }
  }, [callAgent]);

  return (
    <div>
      <h1>Video Meeting</h1>
      {call && (
        <GridLayout
          localParticipant={{
            userId: callAgent.communicationUserId,
            displayName: 'You',
            videoStream: localVideoStream
          }}
          remoteParticipants={call.remoteParticipants}
          onRenderRemoteParticipant={(participant) => (
            <VideoGallery
              key={participant.userId}
              participant={participant}
            />
          )}
        />
      )}
    </div>
  );
};

export default VideoMeeting;


import React, { useRef, useEffect } from 'react';

function Recorder() {
  const sourceVideoRef = useRef(null);
  const mirrorVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const startMirror = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    sourceVideoRef.current.srcObject = stream;

    const configuration = { iceServers: [] };
    const peerConnection = new RTCPeerConnection(configuration);

    peerConnection.ontrack = (event) => {
      mirrorVideoRef.current.srcObject = event.streams[0];
    };

    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    peerConnectionRef.current = peerConnection;
  };

  const stopMirror = () => {
    peerConnectionRef.current.close();
    sourceVideoRef.current.srcObject.getTracks().forEach(function(track) {
      track.stop();
    });
  };

  useEffect(() => {
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      
      <div>
        <video ref={sourceVideoRef} autoPlay />
        {//<video ref={mirrorVideoRef} autoPlay />
        }
      </div>
      <div>
        <button onClick={startMirror}>Start Recording</button>
        <button onClick={stopMirror}>Stop Recording</button>
      </div>
    </div>
  );
}


export default Recorder

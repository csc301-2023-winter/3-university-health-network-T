import React, { useRef, useEffect, useState} from 'react';
import { saveAs } from 'file-saver';

function Recorder() {
  const sourceVideoRef = useRef(null);
  const mirrorVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [url, updateUrl] = useState("");
  let mediaRecorder = null;
  let videoBlob = null

  const startMirror = async () => {
    console.log(navigator.mediaDevices)
    const stream = await navigator.mediaDevices.getUserMedia({ video: true});
    
    sourceVideoRef.current.srcObject = stream;
    const options = { mimeType: 'video/webm;codecs=vp9' };
    mediaRecorder = new MediaRecorder(stream,options);

    const configuration = { iceServers: [] };
    const peerConnection = new RTCPeerConnection(configuration);

    peerConnection.ontrack = (event) => {
      mirrorVideoRef.current.srcObject = event.streams[0];
    };

    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    peerConnectionRef.current = peerConnection;





// Start recording the video track
    mediaRecorder.start();

// When the recording is finished, save the video to a file or a blob
    mediaRecorder.ondataavailable = (event) => {
      videoBlob = new Blob([event.data], {type: 'video/mp4'});
     let u = URL.createObjectURL(videoBlob)
  // Save the video blob to a file or upload it to a server
      saveAs(videoBlob, 'recording.mp4');
// const UploadRecordingExerciseVideo = () => {
//   const [file, setFile] = useState(videoBlob);
//   const [token, setToken] = useState('');
//   const [message, setMessage] = useState('');
      
//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };
      
//   const handleTokenChange = (event) => {
//     setToken(event.target.value);
//   };
      
//   const handleSubmit = async (event) => {
//     event.preventDefault();
      
//     const formData = new FormData();
//     formData.append('token', token);
//     formData.append('file', file);
      
//     try {
//       const response = await fetch('host/home/exercise', {
//         method: 'POST',
//         body: formData,
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         setMessage(data.message);
//       } else {
//         setMessage('Failed to upload file');
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };
      
//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Token:
//           <input type="text" value={token} onChange={handleTokenChange} />
//         </label>
//         <br />
//         <label>
//           File:
//           <input type="file" onChange={handleFileChange} />
//         </label>
//         <br />
//         <button type="submit">Upload</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

      
// export default UploadRecordingExerciseVideo;

      
      
      
      


  updateUrl(u);
  console.log(videoBlob)
};
  };

  const stopMirror = () => {
    peerConnectionRef.current.close();
    mediaRecorder.stop();
    console.log("a")
    sourceVideoRef.current.srcObject.getTracks().forEach(function(track) {
      console.log(track)
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
        {//<video src={url} autoPlay />
        url?<button><link download={'video.mp4'} href={url}></link></button>:"b"
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

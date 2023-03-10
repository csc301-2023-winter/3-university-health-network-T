import * as React from "react";
import useAudioRecorder from "./audioRecorder";
import { useState } from "react";

import "./style.css";

function MicrophoneChecker() {
  let [audioURL, isRecording, startRecording, stopRecording] = useAudioRecorder();
  const [on, setOn] = useState(true);



  return (
    <div className="App">
      <br/>
      <audio src={audioURL} controls />

      {!isRecording ? (<button className="" onClick={startRecording} disabled={isRecording}>
        start recording
      </button>) : (<button onClick={stopRecording} disabled={!isRecording}>
        stop recording
      </button>)}
      
      

      <p>
      <br/>
      <br/>
        Record your own voice and click re-play to check microphone and speaker
    
      </p>
    </div>
  );
}

export default MicrophoneChecker;
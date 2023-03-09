import * as React from "react";
import sample from './speakertest_sample.mp3'

function SpeakerChecker() {


  return (
    <div className="App">
      <audio src={sample} controls />
    </div>
  );
}

export default SpeakerChecker;
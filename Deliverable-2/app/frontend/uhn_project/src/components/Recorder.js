import React, { useRef, useEffect, useState} from 'react';
import { saveAs } from 'file-saver';
import { server_url } from '../global';
import * as poseDetection from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Pose } from '@mediapipe/pose';
import { POSE_CONNECTIONS } from '@mediapipe/pose';

function Recorder(props) {
  
  props.connection.recorder = this
  const sourceVideoRef = useRef(null);
  const mirrorVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [url, updateUrl] = useState("");
  const canvasRef = useRef(null);
  const poseRef = useRef(null)
  let mediaRecorder = null;
  let videoBlob = null
  var body_joints=null
  poseRef.current = new Pose({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  }})
  poseRef.current.initialize();
  poseRef.current.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
  poseRef.current.onResults(async (result)=>{
  const canvas = canvasRef.current;
  canvas.width = sourceVideoRef.current.videoWidth;
  canvas.height = sourceVideoRef.current.videoHeight;
  var context = canvas.getContext('2d')
  context.drawImage(result.image, 0, 0);
  drawConnectors(context, result.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
  var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  createImageBitmap(imageData).then((imageBitmap)=>{
  rescale(imageBitmap,canvas,!props.connection.showing_avatar)
  //console.log(imageBitmap)
  //canvas.width = window.innerWidth//sourceVideoRef.current.videoWidth*2;
  //canvas.height = window.innerHeight//sourceVideoRef.current.videoHeight;
  //context.scale(-1, 1);
  //console.log(imageBitmap, window.innerWidth/2,window.innerHeight/2,window.innerWidth/2,window.innerHeight/2)
  //context.drawImage(imageBitmap, -window.innerWidth,0,window.innerWidth,window.innerHeight);
  //context.setTransform(1, 0, 0, 1, 0, 0)
  //context.scale(window.innerWidth/sourceVideoRef.current.videoWidth, window.innerHeight/sourceVideoRef.current.videoHeight);
  //console.log(context)
  body_joints.push(result.poseLandmarks)
  })
  await draw()

  //drawLandmarks(canvasRef.current.getContext('2d'), result.poseLandmarks, {
    //connections: POSE_CONNECTIONS,
    //landmarkRadius: 2,
    //color: 'red',
  //});
  //result.poseLandmarks.forEach((position)=>{
    //canvas.getContext('2d').fillRect(position.x*sourceVideoRef.current.videoWidth,position.y*sourceVideoRef.current.videoHeight,10,10)
  //})

    //console.log(result)
  })


  
  const startMirror = async () => {
    body_joints=[]
    console.log(navigator.mediaDevices)
    const stream = await navigator.mediaDevices.getUserMedia({ video: {
      zoom: 12.0
    }});
    
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
      //saveAs(videoBlob, 'recording.mp4');
// const UploadRecordingExerciseVideo = () => {
//   const [file, setFile] = useState(videoBlob);
//   const [token, setToken] = useState('');
//   const [message, setMessage] = useState('');
      
//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };


const myHeaders = new Headers();
const token = localStorage.getItem("token");
myHeaders.append("Authorization", `Bearer ${token}`);

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + (today.getSeconds()>9?today.getSeconds():'0'+today.getSeconds());



const body_joints_form_data = new FormData()
const jsonBlob = new Blob([JSON.stringify(body_joints)], { type: 'application/json' });
//saveAs(jsonBlob, 'joints.json');
body_joints_form_data.append('joints', jsonBlob, 'joints');
u = URL.createObjectURL(jsonBlob)
body_joints_form_data.append('Date',date)
body_joints_form_data.append('Time',date+' '+time)
body_joints_form_data.append('BodyJointsID','1')
// Make a POST request to the server
fetch(server_url+'/record/upload/joints', {
 method: 'POST',
 body: body_joints_form_data,
 headers:myHeaders 
})
.then(response => {
 // Handle the response from the server
 console.log(response.json())
})
.catch(error => {
 // Handle any errors that occurred during the request
 console.log(error)
});


 //updateUrl(u);
 console.log(jsonBlob)












const formData = new FormData();

// Add the MP4 Blob to the FormData object

formData.append('video', videoBlob, 'video');
formData.append('VideoID','1')
        
formData.append('Date',date)
formData.append('Time',date+' '+time)
// Make a POST request to the server
fetch(server_url+'/record/upload/video', {
  method: 'POST',
  body: formData,
  headers:myHeaders 
})
.then(response => {
   //Handle the response from the server
  console.log(response.json())
})
.catch(error => {
   //Handle any errors that occurred during the request
});

  
};
setTimeout(async()=>await draw(),500)  
};

  let pause=function(){
    console.log(mediaRecorder)
    if(mediaRecorder){
      mediaRecorder.pause()
    }
    //sourceVideoRef.current.srcObject.getTracks().forEach((t)=>{console.log(t); t.enabled = false})
  };
    let cont = async function(){
      console.log(mediaRecorder)
    if(mediaRecorder){
      mediaRecorder.resume()
    }
    await draw()
      //sourceVideoRef.current.srcObject.getTracks().forEach((t)=>{console.log(t);t.enabled = true})
    }
    props.connection.recorder={
      stop:pause,
      cont: cont
  }

  const stopMirror = () => {
    peerConnectionRef.current.close();
    mediaRecorder.stop();
    console.log("a")
    sourceVideoRef.current.srcObject.getTracks().forEach(function(track) {
      console.log(track)
      track.stop();
    });
  };
  /** 
  const initPostConnection=()=>{
    const poseDetectionPipeline = new poseDetection.Pose();
    poseDetectionPipeline.setOptions({upperBodyOnly: false})
    poseDetectionPipeline.onResults((result)=>{
        console.log(result)
    })
    console.log('aaa')
    //poseDetectionPipeline.start()
    poseDetectionPipeline.send()
  }
  useEffect(() => {
    initPostConnection()
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);
  */
  const testfunction=async ()=>{
    //if(sourceVideoRef.current){
      //console.log(sourceVideoRef.current.srcObject.clone()==sourceVideoRef.current.srcObject.clone())
      //}
      //console.log(await every_frame())
      //console.log(await draw())
      //canvasRef.current.getContext('2d').scale(-1, 1);
  }

  const draw = async()=>{
    if(mediaRecorder.state!="recording"){
      return
    }
  if(!!(sourceVideoRef.current.currentTime > 0 && !sourceVideoRef.current.paused && !sourceVideoRef.current.ended && sourceVideoRef.current.readyState > 2)){
    
    await timmer(100).then((a)=>{
      var c = sourceVideoRef.current
      //console.log(c)
      poseRef.current.send({image:sourceVideoRef.current })   
    })
  }
  }
  const timmer = async(time)=>{
    return new Promise(resulve=>{
      setTimeout(()=>{
        resulve('?')
      },time)
    })
  }
  
  return (
    <div>
      
      <div >
        
        <canvas id='displayer' ref={canvasRef} style={{position:'relative'}}  onClick={()=>{props.connection.showing_avatar=false}}></canvas>
        <video ref={sourceVideoRef} autoPlay id='revorded_output' style={{width:'0px'}}/>
      </div>
      <div>
        <button onClick={startMirror}>Start Recording</button>
        <button onClick={stopMirror}>Stop Recording</button>
        
      </div>
      {//<video src={url} autoPlay />
        //url?<button><link download={'video.mp4'} href={url}></link></button>:""
      }
    </div>
  );
}


const rescale=(imageBitmap,canvas,showing)=>{
  //console.log(canvas.style)
  var context = canvas.getContext('2d')
  let w = window.innerWidth//sourceVideoRef.current.videoWidth*2;
  let h = window.innerHeight//sourceVideoRef.current.videoHeight;
  if(!showing){
    
  canvas.style.position='absolute'
  canvas.style.right='0px'
  canvas.style.bottom='0px'
    w = w/4
    h = h/4
  }else{
    
  canvas.style.position='relative'
  
  canvas.style.right=''
  }
  canvas.width = w//sourceVideoRef.current.videoWidth*2;
canvas.height = h//sourceVideoRef.current.videoHeight;
context.scale(-1, 1);
//console.log(imageBitmap, window.innerWidth/2,window.innerHeight/2,window.innerWidth/2,window.innerHeight/2)
context.drawImage(imageBitmap, -w,0,w,h);
//context.setTransform(1, 0, 0, 1, 0, 0)
}
export default Recorder

import "react-icons/bs";
import "./style.css";
import Menu from "../Component/Menu";
import { useEffect, useState } from "react";
import CameraChecker from "./cameraCheck";
import MicrophoneChecker from "./microphoneChecker";
import SpeakerChecker from "./speakertest";
import InternetCheck from "./internetCheck";
import React from 'react';
import Popup from './popup';


const SettingsPopUP = () => {
  const [camera, setCamera] = useState(false);
  const [microphone, setMicrophone] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [internet, setInternet] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

 
  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  const toggleCamera = () => {
    setCamera(!camera);
  }

  const toggleMicrophone = () => {
    setMicrophone(!microphone);
  }

  const toggleSpeaker = () => {
    setSpeaker(!speaker);
  }

  const toggleInternet = () =>{
    setInternet(!internet);
  }


  return (
    <>
    <Menu/>
      <div class="vertical-menu">

    {isOpen && camera && <Popup content={<CameraChecker/>} handleClose={()=>{togglePopup(); toggleCamera();}}/>}
    {isOpen && microphone && <Popup content={<MicrophoneChecker/>} handleClose={()=>{togglePopup(); toggleMicrophone();}}/>}
    {isOpen && speaker && <Popup content={<SpeakerChecker/>} handleClose={()=>{togglePopup(); toggleSpeaker();}}/>}
    {isOpen && internet && <Popup content={<InternetCheck/>} handleClose={()=>{togglePopup(); toggleInternet();}}/>}

   <a type="button"
      value="Click to Open Popup"
      onClick={()=> {togglePopup(); toggleCamera();}}>Camera Check</a> 

  <a type="button"
      value="Click to Open Popup"
      onClick={()=> {togglePopup(); toggleMicrophone();}}>Mircrophone Check</a>

  <a type="button"
      value="Click to Open Popup"
      onClick={()=> {togglePopup(); toggleSpeaker();}}>Speaker Check</a>

  <a type="button"
      value="Click to Open Popup"
      onClick={()=> {togglePopup(); toggleInternet();}}>Internet Check</a>
 
</div>
    </>
  );
};

export default SettingsPopUP;

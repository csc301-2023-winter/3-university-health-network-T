import React, { useState, useEffect } from "react";
import axios from "axios";
import DateDisplay from "./formatDate";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { server_url } from '../global';

/**
 * A React functional component that displays a pop-up window with information about a user's prescribed exercise
 * and upcoming meeting. The component fetches data from a server using a GET request and uses the react-bootstrap
 * and react-router-dom libraries to display buttons and navigate to a different route. The component receives props
 * that control whether or not the pop-up window is displayed and whether or not a "Continue" button is displayed.
 * 
 * @param {Object} props - The props object that contains the component's properties and functions.
 * @param {boolean} props.cont - A boolean value that controls whether or not the "Continue" button is displayed.
 * @param {Object} props.connection - An object that contains functions to pause and continue the pop-up window.
 * @param {boolean} props.connection.homepop.stop - A function that pauses the pop-up window.
 * @param {boolean} props.connection.homepop.cont - A function that continues the pop-up window.
 * @param {boolean} props.connection.homepop - An object that contains the stop and cont functions.
 * @param {boolean} props.showing - A boolean value that controls whether or not the pop-up window is displayed.
 * @param {boolean} props.connection - A boolean value that controls whether or not the component is connected to a server.
 * @returns {JSX.Element} - A pop-up window with information about a user's prescribed exercise and upcoming meeting.
 */



function HomePopUP(props) {
  const [exerciseData, setExerciseData] = useState(null);
  const [meetingData, setMeetingData] = useState(null);
  const [showing, setShowing] = useState(false);
  const location = useLocation();


  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const today = new Date();
  const formattedDate = formatDate(today);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${server_url}/popup`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data.data;
        setExerciseData(data.exercises);
        setMeetingData(data.upcoming_m);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token]);

  const renderExercise = () => {
    return (
      <ol>
        {exerciseData?.map((exercise) => (
          <li key={exercise.exercise}>
            {exercise.exercise}: {exercise.number_sets} sets of{" "}
            {exercise.number_repetitions} repetitions
          </li>
        ))}
      </ol>
    );
  };

  const renderMeeting = () => {
    if (meetingData) {
      localStorage.setItem("meetingid", meetingData.meetingid);
      return (
        <>
          {meetingData.date.slice(0, 10)} {meetingData.starttime.slice(0, 5)} -{" "}
          {meetingData.endtime.slice(0, 5)}
        </>
      );
    } else {
      return " -- There is no upcoming meeting";
    }
  };

  const handleJoinClick = () => {
    const groupId = localStorage.getItem("meetingid");
    const url = `https://uhnmeet.azurewebsites.net/?groupId=${groupId}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const continue_extrice=()=>{
    if(props&&props.cont){
      props.cont()
    }else{
      console.log('???')
    }
  }
  let pause = function(){
    console.log('hp')
    setShowing(true);};
  let cont = function(){
    console.log('hc')
    setShowing(false);}
  if(props.connection){
    props.connection.homepop=
    {
      stop:pause,
      cont: cont
  }
  }
  return (
    
    
      <div>
      {(!props.cont)||showing?
        <div style={props.cont?{position:'absolute', top:'0px',width:'100%',height:'100%', backgroundColor:'rgba(0, 0, 0, 0.5)'}:{}}>
    <div id="out-box" style={{backgroundColor:'#ffffff'}}>
      <DateDisplay date={formattedDate} />
      <p>Your prescribed exercise for today:</p>
      <br />
      <div id="list-exercise">
        <h5>Exercise Info</h5>
        {exerciseData ? renderExercise() : "There is no prescribed exercise"}

        
          {props.cont?<button className="buttons" onClick={continue_extrice}>Continue</button>: ""}

        <a href="/video">
          <Button className="buttons">Restart</Button>
        </a>
      </div>
      <div id="list-meetings">
        <br />
        <h5>Upcoming Meeting</h5>
        {renderMeeting()}
      </div>
      <br />
      <Button className="buttons" onClick={handleJoinClick}>
        Join
      </Button>
    </div>
    </div>
    :<div>  </div>}
    </div>
  );
}

export default HomePopUP;

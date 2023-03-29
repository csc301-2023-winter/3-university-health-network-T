import React, { useState, useEffect } from "react";
import axios from "axios";
import DateDisplay from "./formatDate";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function HomePopUP(props) {
  const [exerciseData, setExerciseData] = useState(null);
  const [meetingData, setMeetingData] = useState(null);
  const [showing, setShowing] = useState(false)

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
      .get("http://localhost:4000/popup", {
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
      {showing?
        <div style={{position:'absolute', top:'0px',width:'100%',height:'100%', backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
    <div id="out-box" style={{backgroundColor:'#ffffff'}}>
      <DateDisplay date={formattedDate} />
      <p>Your prescribed exercise for today:</p>
      <br />
      <div id="list-exercise">
        <h5>Exercise Info</h5>
        {exerciseData ? renderExercise() : "There is no prescribed exercise"}

        
          <button className="buttons" onClick={continue_extrice}>Continue</button>

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

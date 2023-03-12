import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DateDisplay from './formatDate';
import {Button} from "react-bootstrap";

function HomePopUP({ token }) {
  const [exerciseData, setExerciseData] = useState(null);
  const [meetingData, setMeetingData] = useState(null);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const today = new Date();
  const formattedDate = formatDate(today);
  

  useEffect(() => {
    axios.get('http://localhost:5000/popup', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        const data = response.data.data;
        setExerciseData(data.exercises);
        setMeetingData(data.upcoming_m);
      })
      .catch(error => {
        console.error(error);
      });
  }, [token]);

  if (!exerciseData || !meetingData) {
    return <div>Loading...</div>;
  }

  return (
    <div id="out-box">
      <DateDisplay date={formattedDate} />
      <p>Your prescribed exercise for today:</p><br/>
      <div id="list-exercise">
      <h5>Exercise Info</h5>
      <ol>
        {exerciseData.map(exercise => (
          <li key={exercise.exercise}>
            {exercise.exercise}: {exercise.number_sets} sets of {exercise.number_repetitions} repetitions
          </li>
        ))}
      </ol>
      <Button className='buttons'>Continue</Button>
      <Button className='buttons'>Restart</Button>
      </div>
      <div id="list-meetings"><br/>
      <h5 >Upcoming Meeting</h5>
      {meetingData.date.slice(0, 10)},  {meetingData.starttime.slice(0,5)} - {meetingData.endtime.slice(0,5)}</div><br/>
      <Button className='buttons'>Join</Button>

    </div>
  );
}




export default HomePopUP;

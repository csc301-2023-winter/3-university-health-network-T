import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DateDisplay from './formatDate';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HomePopUP() {
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
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('http://localhost:4000/popup', {
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
            {exercise.exercise}: {exercise.number_sets} sets of {exercise.number_repetitions} repetitions
          </li>
        ))}
      </ol>
    );
  };

  const renderMeeting = () => {
    if (meetingData) {
      localStorage.setItem('meetingid', meetingData.meetingid);
      return (
        <>
          {meetingData.date.slice(0, 10)} {meetingData.starttime.slice(0, 5)} -{' '}
          {meetingData.endtime.slice(0, 5)}
        </>
      );
    } else {
      return ' -- There is no upcoming meeting';
    }
  };

  return (
    <div id="out-box">
      <DateDisplay date={formattedDate} />
      <p>Your prescribed exercise for today:</p>
      <br />
      <div id="list-exercise">
        <h5>Exercise Info</h5>
        {exerciseData ? renderExercise() : 'There is no prescribed exercise'}

        <a href="/video">
          <Button className="buttons">Continue</Button>
        </a>
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
      <Button className="buttons">
        <a
          className="join-link"
          href={`https://uhnmeet.azurewebsites.net/?groupId=${localStorage.getItem('meetingid')}`}
          target="_blank"
          rel="noreferrer"
        >
          Join
        </a>
      </Button>


    </div>
  );
}

export default HomePopUP;


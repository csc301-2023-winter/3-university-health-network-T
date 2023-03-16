import { useState, useEffect } from 'react';
import "./agenda.css";

const Agenda = () =>{
  const [data, setData] = useState(null);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNjc4OTI5NzA2LCJleHAiOjE2NzkwMTYxMDZ9.Z1X8zdWOGYN5wJb0c3AMh2Wg-KTOSk0TRmNQDJAeQPs";

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`http://localhost:5000/calendar/day`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const responseData = await response.json();
      setData(responseData.data);
    }
    fetchData();
  }, [token]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="display-container">
    {Object.keys(data).map((dateKey) => (
      <div key={dateKey} className="each-date">
        <h2 className="date-header">{dateKey}</h2>
        {data[dateKey].exercises?.length > 0 && (
          <div className="exercises-list">
            <h5>Exercises</h5>
            <ul>
              {data[dateKey].exercises.map((exercise, index) => (
                <li key={index} className="exercise-item">
                  <p className="exercise-name">{exercise.exercise}</p>
                  <p className="exercise-sets-repetitions">Sets: {exercise.number_sets}, Repetitions: {exercise.number_repetitions}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {data[dateKey].meetings?.length > 0 && (
          <div className="meetings-list">
            <h5>Meetings</h5>
            <ul>
              {data[dateKey].meetings.map((meeting, index) => (
                <li key={index} className="meeting-item">
                  <p className="meeting-id">Meeting ID: {meeting.meetingid}</p>
                  <p className="meeting-time">Start Time: {meeting.starttime}, End Time: {meeting.endtime}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ))}
  </div>
  );
}



export default Agenda;


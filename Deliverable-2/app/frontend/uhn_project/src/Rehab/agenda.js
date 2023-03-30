import { useState, useEffect } from "react";
import "./agenda.css";

/**
 * React functional component that displays a list of dates, with exercises and meetings for each date.
 * 
 * The component sends an HTTP request to the server to fetch the data from the endpoint http://localhost:4000/calendar/day.
 * The Authorization header is set with the token retrieved from the localStorage.
 * 
 * @returns JSX element that contains a div with a class of display-container that holds the list of dates.
 * Each date is represented by a div element with a class of each-date.
 * If there are any exercises or meetings for that date, they are rendered in a separate div element with a class of exercises-list or meetings-list, respectively.
 * Each list contains a h5 element that displays the title of the list and a ul element that contains a list of li elements with a class of exercise-item or meeting-item.
 * The li elements contain p elements that display the name and details of the exercise or meeting.
 */


const Agenda = () => {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`http://localhost:4000/calendar/day`, {
        headers: { Authorization: `Bearer ${token}` },
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
                    <p className="exercise-sets-repetitions">
                      Sets: {exercise.number_sets}, Repetitions:{" "}
                      {exercise.number_repetitions}
                    </p>
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
                    <p className="meeting-id">
                      Meeting ID: {meeting.meetingid}
                    </p>
                    <p className="meeting-time">
                      Start Time: {meeting.starttime}, End Time:{" "}
                      {meeting.endtime}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Agenda;

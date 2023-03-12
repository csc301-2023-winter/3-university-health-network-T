import { useState, useEffect } from 'react';

const Agenda = (token) =>{
    // const [calendarData, setCalendarData] = useState(null);

    // useEffect(() => {
    //   const fetchCalendar = async () => {
    //     const response = await fetch('calendar/days', {
    //       method: 'GET',
    //       headers: {
    //         'Authorization': `Bearer ${token}`
    //       }
    //     });
    //     const data = await response.json();
    //     setCalendarData(data);
    //   };
  
    //   fetchCalendar();
    // }, [token]);
  
    // if (!calendarData) {
    //   return <div>Loading...</div>;
    // }
  
    // const { message, data } = calendarData;
  
    // if (message !== 'success') {
    //   return <div>Error: {message}</div>;
    // }
  
    // const { dates } = data;

  
    return (
    //   <div>
    //     {dates.map(date => (
    //       <div key={date.date}>
    //         <h2>{date.date}</h2>
    //         {date.exes.map(exercise => (
    //           <div key={exercise.exercise}>
    //             <h3>{exercise.exercise}</h3>
    //             <p>Sets: {exercise.no_sets}</p>
    //             <p>Reps: {exercise.no_reps}</p>
    //           </div>
    //         ))}
    //         {date.meeting.map(meeting => (
    //           <div key={meeting.mid}>
    //             <h3>Meeting</h3>
    //             <p>Start Time: {meeting.starttime}</p>
    //             <p>End Time: {meeting.endtime}</p>
    //           </div>
    //         ))}
    //       </div>
    //     ))}
    //   </div>
    <h3>agenda to be implemented</h3>
    );
  }


export default Agenda;


import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parse } from "date-fns";
import InfiniteScroll from "react-infinite-scroll-component";
import "./calendar.css";
import Menu from "../Component/Menu";



const token = localStorage.getItem("token");
const Calendar = () => {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({ meetings: [], exercises: [], both: [] });
  const [dailyEvents, setDailyEvents] = useState([]);
  // Add a state for the end date of the currently fetched events
const [endDate, setEndDate] = useState(new Date());
const [hasMore, setHasMore] = useState(true);
const [isFirstLoad, setIsFirstLoad] = useState(true);

const pageSize = 10;


const fetchNextDaysEvents = async () => {
  const nextStartDate = new Date(endDate);
  nextStartDate.setDate(nextStartDate.getDate() + 1);
  const nextEndDate = new Date(nextStartDate);
  nextEndDate.setDate(nextEndDate.getDate() + 6); // Change the number here to set how many days to fetch at once

  const response = await fetch("http://localhost:5000/calendar/day", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    
  });

  const data = await response.json();

  if (data.data) {
    // Map the data from the API response to the desired format
    const newDailyEvents = Object.entries(data.data).map(([date, eventData]) => ({
        date,
        exercises: eventData.exercises || [],
        meetings: eventData.meetings || [],
      }));
      

    setDailyEvents((prevDailyEvents) => [...prevDailyEvents, ...newDailyEvents]);
    setEndDate(nextEndDate);
    if (Object.keys(data.data).length < pageSize) {
        setHasMore(false);
    }
  } else {
    console.error(data.message);
  }
};



  const fetchMonthEvents = async (date) => {
    const response = await fetch("http://localhost:5000/calendar/year", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization":`Bearer ${token}`
      },
    //   body: JSON.stringify({ token, date: format(date, "yyyyMM") }),
    });

    const data = await response.json();
    if (data.data) {
        setEvents(data.data);
    } else {
      console.error(data.message);
    }
  };

//   const fetchDayEvents = async (date) => {
//     const response = await fetch("http://localhost:5000/calendar/day", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization":`Bearer ${token}`
//       },
//     //   body: JSON.stringify({ token, date: format(date, "yyyy-MM-dd") }),
//     });

//     const data = await response.json();
//     if (data.data) {
//         const selectedDate = format(date, "yyyy-MM-dd");
//         setEvents({ [selectedDate]: data.data[selectedDate] });
//     } else {
//       console.error(data.message);
//     }
//   };

  useEffect(() => {
    if (view === "month") {
      fetchMonthEvents(date);
    } else if (view === "day" && isFirstLoad ) {
      fetchNextDaysEvents();
      setIsFirstLoad(false);
    }
  }, [view, date]);

  const changeView = (newView) => {
    setView(newView);
  };

  const prev = () => {
    setDate((prevState) => new Date(prevState.getFullYear(), prevState.getMonth() - 1, prevState.getDate()));
  };

  const next = () => {
    setDate((prevState) => new Date(prevState.getFullYear(), prevState.getMonth() + 1, prevState.getDate()));
  };

  const getCellClassName = (day) => {
    let className = "calendar-cell";
    const eventDate = format(day, "yyyy-MM-dd");
  
    const isMeeting = events.meetings && events.meetings.includes(eventDate);
    const isExercise = events.exercises && events.exercises.includes(eventDate);
    const isBoth = events.both && events.both.includes(eventDate);

    if (isSameDay(day, new Date())) {
      className += " calendar-cell-today";
    }
  
    if (isBoth) {
      className += " calendar-cell-blue";
    } else if (isMeeting) {
      className += " calendar-cell-red";
    } else if (isExercise) {
      className += " calendar-cell-green";
    }
  
    return className;
  };
  
  


  const renderMonthView = () => {
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(date),
      end: endOfMonth(date),
    });
  
    const firstDayOfMonth = startOfMonth(date).getDay();
    const lastDayOfMonth = endOfMonth(date).getDay();
  
    const blankDaysBefore = Array.from({ length: firstDayOfMonth }, (_, i) => i);
    const blankDaysAfter = Array.from({ length: 6 - lastDayOfMonth }, (_, i) => i);
  
    return (
      <div className="calendar-grid">
        <div className="calendar-row">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        {blankDaysBefore.map((_, index) => (
          <div key={`blank-before-${index}`} className="calendar-cell calendar-cell-empty"></div>
        ))}
        {daysInMonth.map((day, index) => (
          <div key={index} className={getCellClassName(day)}>
            {format(day, "d")}
          </div>
        ))}
        {blankDaysAfter.map((_, index) => (
          <div key={`blank-after-${index}`} className="calendar-cell calendar-cell-empty"></div>
        ))}
      </div>
    );
  };
  
  
  const renderDayView = () => {
    if (dailyEvents.length === 0) {
      return <p>No events for the selected days.</p>;
    }
  
    // return (
    //   <div className="day-view">
    //     <InfiniteScroll
    //     dataLength={dailyEvents.length}
    //     next={fetchNextDaysEvents}
    //     hasMore={hasMore}
    //     loader={<h4>Loading...</h4>}
    //     endMessage={
    //         <p style={{ textAlign: "center" }}>
    //         <b>End of content</b>
    //         </p>
    //     }
    //     >
    //       {dailyEvents.map((dayEvent, index) => (
    //         <div key={index} className="day-event">
    //           <h3>{format(parse(dayEvent.date, "yyyy-MM-dd", new Date()), "EEEE, MMMM d, yyyy")}</h3>
    //           {dayEvent.meetings.length > 0 && (
    //             <div>
    //               <h4>Meetings:</h4>
    //               <ul>
    //                 {dayEvent.meetings.map((meeting, index) => (
    //                   <li key={index}>
    //                     {meeting.starttime}-{meeting.endtime}
    //                   </li>
    //                 ))}
    //               </ul>
    //             </div>
    //           )}
    //           {dayEvent.exercises.length > 0 && (
    //             <div>
    //               <h4>Exercises:</h4>
    //               <ul>
    //                 {dayEvent.exercises.map((exercise, index) => (
    //                   <li key={index}>
    //                     {exercise.exercise}: {exercise.number_repetitions} repetitions
    //                   </li>
    //                 ))}
    //               </ul>
    //             </div>
    //           )}
    //         </div>
    //       ))}
    //     </InfiniteScroll>
    //   </div>
    // );
  };

  const renderCalendar = () => {
    return (
      <div className="calendar">
        <div className="calendar-header">
        {/* <button onClick={() => changeView("month")}>
          <MdCalendarMonth /> 
        </button>
        <button onClick={() => changeView("day")}>
          <IoMdToday /> 
        </button> */}
      </div>
        {view === "month" && (
          <>
            <div className="calendar-navigation">
              <button onClick={prev}>&lt;</button>
              <span>{format(date, "MMM yyyy")}</span>
              <button onClick={next}>&gt;</button>
            </div>
            {renderMonthView()}
          </>
        )}
        {view === "day" && renderDayView()}
      </div>
    );
  };
  

  return (
    <>
    
    <div className="calendar-container"> {renderCalendar()}</div>
    </>
  );
};

export default Calendar;





       

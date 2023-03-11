import React, { useState } from "react";
import "./calendar.css";

const Calendar = ({ datesToHighlightGreen,  datesToHighlightRed}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const today = new Date();

  const daysArray = [];

  const numDays = daysInMonth(currentMonth, currentYear);

  for (let i = 1; i <= numDays; i++) {
    const date = new Date(currentYear, currentMonth - 1, i);
    daysArray.push(date);
  }

  const isHighlightedDateGreen = (date) => {
    return datesToHighlightGreen.some((highlightedDate) => {
      return (
        date.getFullYear() === highlightedDate.getFullYear() &&
        date.getMonth() === highlightedDate.getMonth() &&
        date.getDate() === highlightedDate.getDate() + 1
      );
    });
  };

  const isHighlightedDateRed = (date) => {
    return datesToHighlightRed.some((highlightedDate) => {
      return (
        date.getFullYear() === highlightedDate.getFullYear() &&
        date.getMonth() === highlightedDate.getMonth() &&
        date.getDate() === highlightedDate.getDate() + 1
      );
    });
  };

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="calendar">
      <div className="month-header">
        <button className="prev" onClick={prevMonth}>
          &#8249;
        </button>
        <div className="month-title">
          {monthNames[currentMonth - 1]} {currentYear}
        </div>
        <button className="next" onClick={nextMonth}>
          &#8250;
        </button>
      </div>
      <div className="days-header">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="days-grid">
        {daysArray.map((date, index) => {
          const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

          const isSelected =
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();

          const isHighlightedgreen = isHighlightedDateGreen(date);
          const isHighlightedred = isHighlightedDateRed(date);

          const dayClasses = `day-cell ${isToday ? "today" : ""} ${
            isSelected ? "selected" : ""
          } ${isHighlightedgreen ? "highlightgreen" : ""} ${isHighlightedred ? "highlightred" : ""} `;

          return (
            <div
              key={index}
              className={dayClasses}
              onClick={() => setSelectedDate(date)}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

import React from 'react';

//provides a reusable and flexible way to display formatted dates in React applications.
//By passing in a date string as a prop, the component can display the formatted date in a consistent and user-friendly way.

function formatDate(dateString) {
  const dateObj = new Date(dateString);
  const month = dateObj.toLocaleString('en-us', { month: 'long' });
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  return `${month} ${day}, ${year}`;
}

function DateDisplay({ date }) {
  const formattedDate = formatDate(date);

  return (
    <div>
      <p>{formattedDate}</p>
    </div>
  );
}

export default DateDisplay;

import React from 'react';

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

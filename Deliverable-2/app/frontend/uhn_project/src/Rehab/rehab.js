import React, { useState, useEffect } from "react";
import Calendar from "./calendar";
import axios from 'axios';

const Rehab = () => {
    // const [datesToHighlightGreen, setDatesToHighlightGreen] = useState([]);
    // const [datesToHighlightRed, setDatesToHighlightRed] = useState([]);
  
    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       const response = await axios.get("http://localhost:5000/home/popup", {
    //         headers: {
    //           Authorization: "Bearer {token}",
    //         },
    //       });
  
    //       if (response.data.success) {
    //         const events = response.data.data;
  
    //         const greenDates = [];
    //         const redDates = [];
  
    //         for (const event of events) {
    //           if (event.meeting === null) {
    //             greenDates.push(new Date(event.date));
    //           } else {
    //             redDates.push(new Date(event.date));
    //           }
    //         }
  
    //         setDatesToHighlightGreen(greenDates);
    //         setDatesToHighlightRed(redDates);
    //       } else {
    //         console.log(response.data.message);
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   };
  
    //   fetchData();
    // }, []);

    const datesToHighlightGreen = [new Date("2023-03-02"), new Date("2023-04-08"), new Date("2023-04-20")]
    const datesToHighlightRed = [new Date("2023-03-20"), new Date("2023-04-21"), new Date("2023-04-25")]
  
    return (
      <div>
        <Calendar
          datesToHighlightGreen={datesToHighlightGreen}
          datesToHighlightRed={datesToHighlightRed}
        />
      </div>
    );
};

export default Rehab;
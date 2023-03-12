import React, { useState, useEffect } from "react";
import Calendar from "./calendar";
import axios from "axios";
import Menu from "../Component/Menu";
import './rehab.css';
import {MdCalendarMonth} from "react-icons/md";
import {IoMdToday} from "react-icons/io";
import {RxSlash} from "react-icons/rx";
import Agenda from "./agenda";

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

  const datesToHighlightGreen = [
    new Date("2023-03-02"),
    new Date("2023-04-08"),
    new Date("2023-04-20"),
  ];
  const datesToHighlightRed = [
    new Date("2023-03-20"),
    new Date("2023-04-21"),
    new Date("2023-04-25"),
  ];

  const [showmonthly, setShowMonthly] = useState(true);

  const toggleMontly = (option) =>{
    
    if(option === "montly"){ setShowMonthly(true);}
    if(option === "day"){setShowMonthly(false);}
   
  }

  return (
    <div>
      <div>
        <div className="child"><Menu /></div>
        

        <div className="child calendar-switch-button">
          <MdCalendarMonth  size={40} onClick={()=>toggleMontly("montly")}/> <RxSlash size={30}/> <IoMdToday size={36} onClick={()=>toggleMontly("day")}/>
        </div>
      </div>
      
      {showmonthly ? <Calendar datesToHighlightGreen={datesToHighlightGreen} datesToHighlightRed={datesToHighlightRed} /> : <Agenda token={localStorage.token}/>}
      
    </div>
  );
};

export default Rehab;

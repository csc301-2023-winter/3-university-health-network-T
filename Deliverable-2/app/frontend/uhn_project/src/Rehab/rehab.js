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
  
  const [datesarray, setDatesArray] = useState([]);
  const token = localStorage.getItem("token");

  // useEffect(() => {
  //   axios.get('http://localhost:5000/calendar/year', {
  //     headers: { 'Authorization': `Bearer ${token}` }
  //   })
  //     .then(response => {
  //       const data = response.data.data;
  //       setDatesArray(data);
  //       console.log(data);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }, []);


  console.log(datesarray);
  // const green = []

  // for (const item of datesarray.exercise){
  //   green.push(item.slice(0, 10));
  // }

  // setDatesToHighlightGreen(green);


  // const red = []

  // for (const item of datesarray.meetings){
  //   red.push(item.slice(0, 10));
  // }

  // setDatesToHighlightGreen(green);

  // setDatesToHighlightRed(red);

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
      
      {showmonthly ? <Calendar/> : <Agenda token={localStorage.token}/>}
      
    </div>
  );
};

export default Rehab;

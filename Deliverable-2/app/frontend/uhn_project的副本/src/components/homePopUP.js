import Button from "react-bootstrap/Button";
import "react-icons/bs";
import "./homePopUp.css";
import { useNavigate } from "react-router-dom";

const HomePopUP = () => {

  let navigate = useNavigate(); 
  const continueRecording = () =>{ 
    let path = `/video`; 
    navigate(path);
  }
  

  return (
    <>
      {/* <div className=" menu-buttons">
    
        <div className="icons">
       
          <BiMenu size={38} />
        </div> 
         <div className="icons">
          <AiOutlineQuestion size={38} />
        </div> 
      </div> */}

      <div id="pop-up-box">
        <div id="list-exercise">
          <p>
            Feb 6, Monday,
            <br /> you prescribed exercise today:
          </p>
          <br />
          <ol>1. Leg extension, 2 sets of 8 rep</ol>
          <ol>2. Lift the arms, 2 sets of 10 reps</ol>
          <ol>3. ....</ol>

          <Button className="buttons" onClick={continueRecording}>Continue</Button>
          <br />
          <Button className="buttons" onClick={continueRecording}>Restart</Button>
        </div>

        <div id="list-meetings">
          <p>Upcoming meeting:</p>
          <ol>Feb 21, 11:30 - 12:30 </ol>
          <Button className="buttons">Join</Button>
        </div>
      </div>
    </>
  );
};

export default HomePopUP;

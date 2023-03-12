import "react-icons/bs";
import "./style.css";
import Menu from "../Component/Menu";
import { useEffect, useState } from "react";


const SettingsPopUP = () => {
  const [camera, setCamera] = useState(false);

  return (
    <>
    <Menu/>
      <div class="vertical-menu">


  <a href="/camerachecker">Camera Check</a>
  <a href="/microphonechecker">Mircrophone Check</a>
  <a href="/speakerchecker">Speaker Check</a>
  <a href="/internetchecker">Internet Check</a>
 
</div>
    </>
  );
};

export default SettingsPopUP;

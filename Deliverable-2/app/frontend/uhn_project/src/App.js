import logo from './logo.svg';
import './App.css';

import HomeMove from './components/homeMenu'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Link, Route, Routes, Router} from "react-router-dom";
import Menu from './Component/Menu';
import Recording_page from './components/Recording_page';
import Register from './Component/Register';
import Login from './Component/Login';
import Rectify from "./Component/Login_email_rectification";
import ForgotPassword from "./Component/Reset_pass";
import BlogC from './Blog/combine';
import ContactC from './Contact/combine';
import HelpC from './Help/combine';
import CameraChecker from './Settings/cameraCheck';
import MicrophoneChecker from './Settings/microphoneChecker';
import SpeakerChecker from './Settings/speakertest';
import SettingsPopUP from './Settings/settingsPopUp';

function App() {
  return (
    <div>
    <BrowserRouter>
     <Routes>
       <Route path="/" element={<Menu/>}></Route>
       <Route path="/home" element={<HomeMove/>}></Route>
       <Route path="/video" element = {<Recording_page/>}></Route>
       <Route path="/register" element = {<Register/>}></Route>
       <Route path="/login" element = {<Login/>}></Route>
       <Route path="/rectify" element = {<Rectify/>}> </Route>
       <Route path="/reset" element = {<ForgotPassword/>}> </Route>
       <Route path="/blog" element = {<BlogC/>}> </Route>
       <Route path="/contact" element = {<ContactC/>}> </Route>
       <Route path="/help" element = {<HelpC/>}> </Route>
       <Route path="/camerachecker" element = {<CameraChecker/>}> </Route>
       <Route path="/microphonechecker" element = {<MicrophoneChecker/>}> </Route>
       <Route path="/speakerchecker" element = {<SpeakerChecker/>}> </Route>
       <Route path="/settings" element = {<SettingsPopUP/>}> </Route>
      </Routes>
    </BrowserRouter>
    </div>

  );
}

export default App;

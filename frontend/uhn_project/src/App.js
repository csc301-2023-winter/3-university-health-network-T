import logo from './logo.svg';
import './App.css';

import HomeMove from './components/homeMenu'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Link, Route, Routes, Router} from "react-router-dom";
import Menu from './Component/Menu';
import Recording_page from './components/Recording_page';
import Register from './Component/Register';
import Login from './Component/Login';

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
      </Routes>
    </BrowserRouter>
    </div>

  );
}

export default App;

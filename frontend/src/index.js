import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Profile from "./Profile/Profile";
import CreateAccount from "./CreateAccount/CreateAccount";
import Login from "./Login/Login";
import "./index.css";


function App() {
  return (
    <Router>
      <Routes>

        <Route exact path="/" element={<p>hi</p>} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login"  element={<Login />}/>
        <Route path="/profile"  element={<Profile />}/>

      </Routes>
    </Router>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

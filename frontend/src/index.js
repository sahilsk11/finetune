import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Profile from "./Profile/Profile";
import Homepage from "./Homepage/home"
import RecoverPassword from "./Homepage/RecoverPassword";
import CreateAccount from "./CreateAccount/CreateAccount";
import EditAccount from './EditAccount/EditAccount';
import Login from "./Login/Login";
import Settings from "./Settings/Settings";
import Quiz from './Quiz/quiz';
import "./index.css";


function App() {

  return (
    <Router>
      <Routes>

        <Route exact path="/" element={<Homepage/>} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login"  element={<Login />}/>
        <Route path="/profile/:id"  element={<Profile />}/>
        <Route path="/edit-account"  element={<EditAccount />}/>
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/quiz" element={<Quiz />} />


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

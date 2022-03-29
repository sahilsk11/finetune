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
import CreatePost from "./CreatePost/CreatePost";
import TrendingMusic from './TrendingMusic/TrendingMusic';
import Search from './Search/Search';
import Feed from './Feed/feed';
import EditPost from './EditPost/EditPost';

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
        <Route path="/trending-music" element={<TrendingMusic />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/search" element={<Search />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/edit-post"  element={<EditPost />}/>




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

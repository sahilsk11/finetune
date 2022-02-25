import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


import NavBar from "../NavBar/NavBar";


function Settings() {

  const navigate = useNavigate();

  function logout() {
    console.log("logging out")
    const logoutOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token")
      }
    }
    fetch(API_URL + "/logout", logoutOptions)
      .then(res => res.json())
      .then(data => {
        if(data !== "success") {
          alert("logout failed")
        }
      })
      .catch(err => {
        alert("server can't logout user")
      });
      localStorage.removeItem("auth_token");
      localStorage.removeItem("username");

      navigate("/login");
  }

  const API_URL = "http://127.0.0.1:5000";

  return(
      <div style={{alignItems: "center"}}>
        <NavBar />
        <h1 style={{color: "beige"}} className="create-account-title">
          Settings
        </h1>
        <div className='profile-container'>
          <button onClick={logout} className='user-actions-logout'>
            Log out
          </button>
          <button onClick={openDeleteModal} className='user-actions-delete-account'>
            Delete Account
          </button><br/>
          <br/>
          <a href="/edit-account"><button className='user-actions-edit-account'> Edit Profile </button></a>
        </div>
      </div>
  )

}

export default Settings;

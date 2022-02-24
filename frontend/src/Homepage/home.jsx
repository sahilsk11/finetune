import React, { Link, useState, useEffect } from 'react';
import './home.css';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';


export default function Homepage() {

  const navigate = useNavigate();

  const handleClick= (e) => {
    if (localStorage.getItem("username")) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  }

  if (localStorage.getItem("username")) {
    navigate("/profile");
  }

    return (
      <div style={{marginTop: "4%", alignItems: "center"}}>
        <h1 className="create-account-title">
          Welcome to FineTune!
        </h1>
        <p style={{textAlign:"center" }}><img src={logo} alt="Logo"/></p>

        <form className="form">
        <button onClick={handleClick}>Enter Finetune</button>
        </form>
      </div>
    )
  }

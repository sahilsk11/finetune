import React, { Link, useState, useEffect } from 'react';
import './home.css';
import logo from './logo.png';


export default function CreateAccount() {
    return (
      <div style={{marginTop: "4%", alignItems: "center"}}>
        <h1 className="create-account-title">
          Welcome to FineTune!
        </h1>
        <p style={{textAlign:"center" }}><img src={logo} alt="Logo"/></p>

        <a href="/login"><button class="button">Enter Finetune</button></a>

      </div>
    )
  }

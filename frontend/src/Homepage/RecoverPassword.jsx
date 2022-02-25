import React, { Link, useState, useEffect } from 'react';
import './home.css';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';


export default function RecoverPassword() {

  const [email, setEmail] = useState(null);
  const navigate = useNavigate();
  const API_URL = "http://127.0.0.1:5000";
  const [loading, setLoading] = useState(false);


  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handleClick(e) {
    e.preventDefault();
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        email: email,
      }
    }
    fetch(API_URL + "/recoverpassword", options)
    .then(resp => {
      setLoading(false);
      if(resp.status === 200) {
        return resp.json();
      }
      else {
        alert("there has been an error!!");
      }
    })

    navigate("/login");
  }

  return(
    <div style={{marginTop: "4%", alignItems: "center"}}>
      <h1 className="create-account-title">
        Welcome to FineTune!
      </h1>
      <p style={{textAlign:"center" }}><img src={logo} alt="Logo"/></p>

      <form className="form">
        <label>
          Enter Email:
          <input className='edit-text-box' placeholder="email" type="text" id="email" onChange={handleEmailChange} value={email} /><br />
        </label>
      <button onClick={handleClick}>Recover</button>
      </form>
    </div>
  )
}

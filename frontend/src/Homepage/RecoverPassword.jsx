import React, { Link, useState, useEffect } from 'react';
import './home.css';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';


export default function RecoverPassword() {
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handleClick(e) {
    e.preventDefault();
    //TODO
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

/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import './login.css';
import logo from './logo.png';



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const API_URL = "http://127.0.0.1:5000";


  const handleClick= () => {
    const options = {
      mehtod: 'POST',
      body: JSON.stringify({
        "email": email,
        "password": password
      })
    }
    fetch(API_URL + "/login", options)
    .then(resp => {
      if(resp.status === 200) return resp.json();
      else alert("there has been an error!!");
    })
    .then()
    .catch(error => {
      console.error("ther was an error", error);
    })
  }

  

  return (
    <div style={{marginTop: "10%", alignItems: "center"}}>
      <h1 className="login-title">
        Welcome back
      </h1>
      <h5 className="login-subtitle">
        Please log in using either your username, phone number, or email.
      </h5>
      <div className="image">
      <p style={{textAlign:"center", width:"200px", height:"auto" }}><img src={logo} alt="Logo"/></p>
      </div>

      <form className="form">
      <input type="text" placeholder="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleClick}>login</button>
      <p className="message">Not registered? <a href="/create-account">Create an account</a></p>
    </form>
        </div>
  )
}

// function LoginForm() {
//   return (
//     <form class="form">
//       <input type="text" placeholder="username" required/>
//       <input type="password" placeholder="password" required/>
//       <button>login</button>
//       <p class="message">Not registered? <a href="/create-account">Create an account</a></p>
//     </form>
//   )
// }

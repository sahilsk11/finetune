/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import logo from './logo.png';



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = "http://127.0.0.1:5000";
  const navigate = useNavigate();



  const handleClick= (e) => {
    e.preventDefault();
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        email: email,
        password: password
      }
    }
    fetch(API_URL + "/login", options)
    .then(resp => {
      setLoading(false);
      if(resp.status === 200) {
        return resp.json();
      }
      else {
        alert("there has been an error!!");
      }
    })
    .then(data => {
      if(
        data === "Incorrect Password or Email!"
      ) {
          setError(true);
          setErrorMessage(data);
          alert(data);
      } else {
      console.log(data)
      localStorage.setItem("username", data.username);
      localStorage.setItem("auth_token", data.auth_token);
      console.log(localStorage.getItem("username"))
      navigate("/profile");
      }
    })
    .catch(error => {
      console.error("ther was an error", error);
    })
  }

  if (localStorage.getItem("username")) {
    navigate("/profile");
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
      <input type="text" placeholder="Email or Phone Number" required value={email} onChange={(e) => setEmail(e.target.value)} />
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

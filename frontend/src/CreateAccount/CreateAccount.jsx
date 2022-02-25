/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
import React, { Link, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './create-account.css';
import logo from './logo.png';



export default function CreateAccount() {
 

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirst] = useState("");
  const [last_name, setLast] = useState("");
  const [phone_number, setPhone] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
   const API_URL = "http://127.0.0.1:5000";
   const navigate = useNavigate();


  const handleSubmit = (event) => {
    event.preventDefault()
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        first_name: first_name,
        last_name: last_name,
        phone_number: phone_number,
        username: username,
        email: email,
        password: password
      }
    };
    setLoading(true);
    fetch(API_URL + "/sign_up", requestOptions)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (
          data === "Email or Username already exists!" ||
          data === "Invalid Email!" || data === "Password needs to be equal to or greater than 8 characters"
        ) {
          setError(true);
          setErrorMessage(data);
          alert(data);
        } else {
          console.log(data);
          localStorage.setItem("username", username);
          localStorage.setItem("auth_token", data.auth_token);
          navigate("/profile/" + username);
        }
      })
      .catch(error => {
        setLoading(false);
        setError(true);
        setErrorMessage("Could not connect to server");
      });
  }
 
  
  return (
    <div style={{marginTop: "4%", alignItems: "center"}}>
      <h1 className="create-account-title">
        Welcome to FineTune!
      </h1>
      <h5 className="create-account-subtitle">
        In a few short steps, you'll be on your way to discovering great music.
      </h5>
      <div className="image">
      <p style={{textAlign:"center", width:"200px", height:"auto" }}><img src={logo} alt="Logo"/></p>
      </div>


      <form className="form" onSubmit={handleSubmit} >
      <input type="text" placeholder="First Name" name="first_name" value={first_name} onChange={(e) => setFirst(e.target.value)} required/>
      <input type="text" placeholder="Last Name" name="last_name" value={last_name} onChange={(e) => setLast(e.target.value)} required/>
      <input type="text" placeholder="Phone Number" name="phone_number" value={phone_number} onChange={(e) => setPhone(e.target.value)} required/>
      <input type="text" placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
      <input type="text" placeholder="Username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Password" name="password"  value={password} onChange={(e) => setPassword(e.target.value)} required/>
      <button type="submit">Create Account</button>
      <p className="message">Already Have an account? <a href="/login">Login</a></p>
    </form>
    </div>
  )
}


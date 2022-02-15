import React, { useState, useEffect } from 'react';
import './login.css';


export default function Login() {
  return (
    <div className='login-container'>
      <h1 className="login-title">
        Welcome back
      </h1>
      <h5 className="login-subtitle">
        Please log in using either your username, phone number, or email.
      </h5>

      <LoginForm />
    </div>
  )
}

function LoginForm() {
  return (
    <form>
      <label>Username</label>
      <br />
      <input />
      <br />
      <label>Password</label>
      <br />
      <input />

      <button className="login-submit-btn">
        Log In
      </button>
      <p className='login-forgot-password'>Forgot Password?</p>
    </form>
  )
}

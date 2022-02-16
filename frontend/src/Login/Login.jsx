/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import './login.css';


export default function Login() {
  return (
    <div style={{marginTop: "10%", alignItems: "center"}}>
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
    <form class="form">
      <input type="text" placeholder="username"/>
      <input type="password" placeholder="password"/>
      <button>login</button>
      <p class="message">Not registered? <a href="/create-account">Create an account</a></p>
    </form>
  )
}

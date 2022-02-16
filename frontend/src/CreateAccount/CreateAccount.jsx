import React, { Link, useState, useEffect } from 'react';
import './create-account.css';


export default function CreateAccount() {
  return (
    <div style={{marginTop: "4%", alignItems: "center"}}>
      <h1 className="create-account-title">
        Welcome to FineTune!
      </h1>
      <h5 className="create-account-subtitle">
        In a few short steps, you'll be on your way to discovering great music.
      </h5>

      <CreateAccountForm />
    </div>
  )
}

function CreateAccountForm() {
  return (
    <form class="form">
      <input type="text" placeholder="First Name"/>
      <input type="text" placeholder="Last Name"/>
      <input type="text" placeholder="Email"/>
      <input type="text" placeholder="Username"/>
      <input type="password" placeholder="password"/>
      <button>Create Account</button>
      <p class="message">Already Have an account? <a href="/login">Login</a></p>
    </form>
  )
}

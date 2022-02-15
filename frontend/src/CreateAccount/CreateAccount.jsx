import React, { useState, useEffect } from 'react';
import './create-account.css';


export default function CreateAccount() {
  return (
    <div className='create-account-container'>
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
    <form>
      <label>First Name</label>
      <br />
      <input />
      <br />
      <label>Last Name</label>
      <br />
      <input />
      <br />
      <label>Email</label>
      <br />
      <input />
      <br />
      <label>Phone Number</label>
      <br />
      <input />

      <button className="create-account-submit-btn">
        Create Account
      </button>
    </form>
  )
}

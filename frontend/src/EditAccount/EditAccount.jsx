import React, { useState, useEffect } from 'react';
import './edit-account.css';
import logo from './logo.png';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar'

export default function EditAccount() {
    return (
      <div style={{alignItems: "center"}}>
        {NavBar()}
        <h1 style={{color: "beige"}} className="create-account-title">
        Edit Account
        </h1>
        <div className='profile-container'>
        <p style={{textAlign:"center" }}><img src={logo} alt="Logo"/></p>
       <button className='user-actions-edit-account'> Edit First Name </button><br/><br/>
       <button className='user-actions-edit-account'> Edit Last Name </button><br/><br/>
       <button className='user-actions-edit-account'> Edit Email </button><br/><br/>
       <button className='user-actions-edit-account'> Edit Username </button><br/><br/>
       <button className='user-actions-edit-account'> Edit Password </button><br/><br/>
        </div>
        

      </div>
    )
  }

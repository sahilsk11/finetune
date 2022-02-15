import React, { useState, useEffect } from 'react';
import './profile.css';


export default function Profile() {
  return (
    <div className='profile-container'>
      <div className='profile-picture-container'>
        <ProfilePicture />
      </div>

      <div className='profile-user-details-container'>
        <UserDetails />
      </div>

      <div className='user-actions-container'>
        <UserActions />
      </div>
    </div>
  )
}

function ProfilePicture() {
  return (
    <img
      src='https://pbs.twimg.com/profile_images/1477952761262055425/7VE1jYkE_400x400.jpg'
      className='profile-picture'
    />
  )
}

function UserDetails() {
  return (
    <table className='profile-user-details'>
      <tr>
        <td className='profile-user-details-left-col'>First Name</td>
        <td className='profile-user-details-right-col'>Sahil</td>
      </tr>
      <tr>
        <td className='profile-user-details-left-col'>Last Name</td>
        <td className='profile-user-details-right-col'>Kapur</td>
      </tr>
      <tr>
        <td className='profile-user-details-left-col'>Email</td>
        <td className='profile-user-details-right-col'>sahilkapur@gmail.com</td>
      </tr>
    </table>
  )
}

function UserActions() {
  return (
    <div className='profile-user-actions'>
      <button className='user-actions-logout'>
        Log out
      </button>
      <p className='user-actions-delete-account'>delete account</p>
    </div>
  )
}
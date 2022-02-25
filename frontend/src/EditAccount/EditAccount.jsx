import React, { useState, useEffect } from 'react';
import './edit-account.css';
import logo from './logo.png';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar'
import ImageUploader from 'react-images-upload';


export default function EditAccount() {
  const [image, saveImage] = useState(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [newUsername, setNewUsername] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const API_URL = "http://127.0.0.1:5000";

  useEffect(() => {
    if (!localStorage.getItem("auth_token")) {
      navigate("/login");
    }
  }, [])

  useEffect(() => {
    if (image !== null && image.length > 0) {
      const formData = new FormData();
      const lastImg = image[image.length - 1];
      formData.append('image', lastImg, lastImg.name);
      fetch("http://localhost:5000/update_profile_photo/", {
      method: "POST",
      headers: {
        profile_user: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token")
      },
      body: formData
      }).then(response => response.json()).then(data => {
      console.log(data);
      });
    }
  }, [image]);

  useEffect(() => {
    fetch(API_URL + "/get_profile_page", {
      method: "POST",
      headers: {
        username: localStorage.getItem("username"),
        profile_user: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token")
      },
    }).then(response => {
      if (response.status !== 200) {
        return null;
      }
      return response.json()
    }).then(data => {
      if (data != null ) {
        setEmail(data.email);
        setPhoneNumber(data.phone_number)
        setUsername(data.username)
        setNewUsername(data.username)
      }
    }).catch(err => {
      alert("could not fetch user data")
    })
  }, [])

  function onEmailChangeSubmit(e) {
    e.preventDefault();
    console.log("changing email")
    fetch(API_URL + "/change_email", {
      method: "POST",
      headers: {
        email: email,
        username: username,
        auth_token: localStorage.getItem("auth_token"),
      },
    })
    .then(resp => {
      if(resp.status !== 200) {
        alert("couldn't update email")
      }
      return resp.json();
    })
    .then(data => {
      if(data === "failed") {
        alert("server could not email")
      }
    })
  }

  function onPhoneNumberChangeSubmit(e) {
    e.preventDefault();
    fetch(API_URL + "/change_phone", {
      method: "POST",
      headers: {
        username: username,
        phone_number: phoneNumber,
        auth_token: localStorage.getItem("auth_token"),
      },
    })
    .then(resp => {
      if(resp.status !== 200) {
        alert("couldn't update phone number")
      }
      return resp.json();
    })
    .then(data => {
      if(data === "failed") {
        alert("server could not phone number")
      }
    })
  }

  function passwordChangeSubmit(e) {
    console.log("Changing password to " + newPassword)
    e.preventDefault();
    fetch(API_URL + "/change_password", {
      method: "POST",
      headers: {
        username: username,
        new_password: newPassword,
        auth_token: localStorage.getItem("auth_token"),
      },
    })
    .then(resp => {
      if(resp.status !== 200) {
        console.log(resp)
        alert("couldn't update password")
      }
      return resp.json();
    })
    .then(data => {
      if(data === "failed") {
        alert("server couldn't update password")
      }
    })
  }

  function usernameChangeSubmit(e) {
    e.preventDefault()
    fetch(API_URL + "/change_username",  {
      method: "POST",
      headers: {
        old_username: username,
        new_username: newUsername,
        auth_token: localStorage.getItem("auth_token"),
      },
    })
    .then(resp => {
      if(resp.status !== 200) {
        console.log(resp)
        alert("couldn't update username")
      }
      return resp.json();
    })
    .then(data => {
      if(data === "failed") {
        alert("server couldn't update username")
      }
    })
    localStorage.removeItem("username")
    localStorage.setItem("username", newUsername)
  }

  function handleEmailChange(e) {
    setEmail(e.target.value)
  }

  function handlePhoneNumberChange(e) {
    setPhoneNumber(e.target.value)
  }

  function handlePasswordChange(e) {
    setNewPassword(e.target.value)
  }

  function handleUsernameChange(e) {
    setNewUsername(e.target.value)
  }

    return (
      <div style={{alignItems: "center"}}>
        {NavBar()}
        <h1 style={{color: "beige"}} className="create-account-title">
        Edit Account
        </h1>
        <div className='profile-container'>
        <p style={{textAlign:"center" }}><img src={logo} alt="Logo"/></p>
        <div className='edit-profile-form-div'>
        <form className='edit-profile-form' onSubmit={onEmailChangeSubmit}>
            <label>
              Edit email:
              <input className='edit-text-box' type="text" id="email" onChange={handleEmailChange} value={email} /><br />
            </label>
            <input className='edit-submit-button' type="submit" value="Submit" />
          </form>
          <form className='edit-profile-form' onSubmit={onPhoneNumberChangeSubmit}>
            <label>
              Edit phone number:
              <input className='edit-text-box' type="text" id="phoneNumber" onChange={handlePhoneNumberChange} value={phoneNumber} /><br />
            </label>
            <input className='edit-submit-button' type="submit" value="Submit" />
          </form>
          <form className='edit-profile-form' onSubmit={passwordChangeSubmit}>
            <label>
              Change password:
              <input className='edit-text-box' type="text" id="password" onChange={handlePasswordChange} value={newPassword} /><br />
              <input className='edit-submit-button' type="submit" value="Submit" />
            </label>
          </form>
          <form className='edit-profile-form' onSubmit={usernameChangeSubmit}>
            <label>
              Change username:
              <input className='edit-text-box' type="text" id="username" onChange={handleUsernameChange} value={newUsername} /><br />
              <input className='edit-submit-button' type="submit" value="Submit" />
            </label>
          </form>

        </div>
       <ImageUploader
            withIcon={true}
            imgExtension={['.jpg', 'jpeg', '.gif', '.png', '.gif']}
            maxFileSize={10000000}
            buttonText='Update your profile picture.'
            className="profile-pic-upload"
            onChange={saveImage}
          />


      </div>
        </div>

    )
  }

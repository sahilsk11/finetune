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

    return (
      <div style={{alignItems: "center"}}>
        {NavBar()}
        <h1 style={{color: "beige"}} className="create-account-title">
        Edit Account
        </h1>
        <div className='profile-container'>
        <p style={{textAlign:"center" }}><img src={logo} alt="Logo"/></p>
       <button className='user-actions-edit-account'> Edit Email </button><br/><br/>
       <button className='user-actions-edit-account'> Edit Username </button><br/><br/>
       <button className='user-actions-edit-account'> Edit Password </button><br/><br/>
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

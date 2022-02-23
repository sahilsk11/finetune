import React, { useState, useEffect } from 'react';
import './profile.css';


export default function Profile({apiURL}) {
  const [profilePictureURL, setProfilePictureURL] = useState("https://pbs.twimg.com/profile_images/1477952761262055425/7VE1jYkE_400x400.jpg")
  const [userData, setUserData] = useState({
    email: ""
  });
  const [pageErr, updatePageErr] = useState(null);

  useEffect(function() {
    fetch("http://localhost:5000/get_profile_page", {
      method: "POST",
      headers: {
        username: "",
        profile_user: "",
      },
    }).then(response => {
      console.log("hit")
      if (response.status !== 200) {
        updatePageErr("could not reach backend");
        return null;
      }
      return response.json()
    }).then(data => {
      if (data != null ) {
        setProfilePictureURL(data.image)
        setUserData({
          email: data.email,
          username: data.username,
          phoneNumber: data.phone_number,
          age: data.age,
          about: data.about
        })
      }
    }).catch(err => {
      updatePageErr(err);
    })
  }, []);

  useEffect(function() {
    if (pageErr != null) {
      alert(pageErr);
    }
  }, [pageErr]);

  return (
    <div className='profile-container'>
      <div className='profile-picture-container'>
        <ProfilePicture imageSrc={profilePictureURL} />
      </div>

      <div className='profile-user-details-container'>
        <UserDetails userData={userData}/>
      </div>

      <div className='user-actions-container'>
        <UserActions />
      </div>
    </div>
  )
}

function ProfilePicture({imageSrc}) {
  return (
    <img
      src={imageSrc}
      alt={"profile picture"}
      className='profile-picture'
    />
  )
}

function UserDetails({userData}) {
  const {
    email,
    username,
    phoneNumber,
    age,
    about
  } = userData;
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
        <td className='profile-user-details-right-col'>{email}</td>
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
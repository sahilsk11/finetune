import React, { useState, useEffect } from 'react';
import './profile.css';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar'

Modal.setAppElement(document.getElementById('root'));

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
    <div>
      {NavBar()}
      <br/>
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

  const API_URL = "http://127.0.0.1:5000";
  const navigate = useNavigate();


  const [deleteModalOpen, setDeleteModal] = useState(false);

  function openDeleteModal() {
    setDeleteModal(true);
  }

  function closeDeleteModal() {
    setDeleteModal(false);
  }

  function handleDelete() {
    console.log("deleting user")
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token")
      }
    };

    fetch(API_URL + "/delete_user", requestOptions)
      .then(res => res.json())
      .then(data => {
        if (data !== "success") {
          alert("delete account failed!");
        }
      })
      .catch(err => {
        alert("server can not delete account " + err);
      });
      localStorage.removeItem("auth_token");
      localStorage.removeItem("username");

      navigate("/login");
    }

  return (
    <div className='profile-user-actions'>
      <button className='user-actions-logout'>
        Log out
      </button>
      <button onClick={openDeleteModal} className='user-actions-delete-account'>
        Delete Account
      </button><br/>
      <br/>
     
     
      <a href="/edit-account"><button className='user-actions-edit-account'> Edit Profile </button></a>
      
     
      <Modal
        isOpen={deleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Account"
        className='delete-modal'
      >
        <h2>Are you sure?</h2>
        <button className='modal-delete-button' onClick={handleDelete}>Delete Account</button>
        <button className='modal-delete-button' onClick={closeDeleteModal}>Cancel</button>
      </Modal>
    </div>
  )
}

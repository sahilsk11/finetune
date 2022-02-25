import React, { useState, useEffect } from 'react';
import './profile.css';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar'

Modal.setAppElement(document.getElementById('root'));

export default function Profile(props) {
  const [profilePictureURL, setProfilePictureURL] = useState("https://180dc.org/wp-content/uploads/2017/11/profile-placeholder.png")
  const [userData, setUserData] = useState({
    email: ""
  });
  const [pageErr, updatePageErr] = useState(null);

  const navigate = useNavigate();
  const params = useParams();

 useEffect(() => {
    if (!localStorage.getItem("auth_token")) {
      navigate("/login");
    }
  }, [])

  useEffect(function() {
    fetch("http://localhost:5000/get_profile_page", {
      method: "POST",
      headers: {
        username: params.id,
        profile_user: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token")
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
        if (data.image !== null && data.image !== "") {
          let host = "http://localhost:5000"
          let path = "/image/"
          let filename = data.image
          setProfilePictureURL(host+path+filename)
        }
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
        <td className='profile-user-details-left-col'>Username</td>
        <td className='profile-user-details-right-col'>{localStorage.getItem("username")}</td>
      </tr>
      <tr>
        <td className='profile-user-details-left-col'>Phone Number</td>
        <td className='profile-user-details-right-col'>{phoneNumber}</td>
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

  function logout() {
    console.log("logging out")
    const logoutOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token")
      }
    }
    fetch(API_URL + "/logout", logoutOptions)
      .then(res => res.json())
      .then(data => {
        if(data !== "success") {
          alert("logout failed")
        }
      })
      .catch(err => {
        alert("server can't logout user")
      });
      localStorage.removeItem("auth_token");
      localStorage.removeItem("username");

      navigate("/login");
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
      <button onClick={logout} className='user-actions-logout'>
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

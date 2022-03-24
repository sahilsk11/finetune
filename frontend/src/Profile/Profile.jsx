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
        username: localStorage.getItem("username"),
        profile_user: params.id,
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
          about: data.about,
          spotifyLink: data.spotify
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
        <UserActions loggedInUser={localStorage.getItem("username")} profilePageUser={params.id} />
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
    about,
    spotifyLink
  } = userData;

  let link = (spotifyLink === null || spotifyLink === "") ? <a href="/edit-account">Add a Link</a> : <a href={spotifyLink}>Go to Spotify</a>;
  return (
    <table className='profile-user-details'>
      <tr>
        <td className='profile-user-details-left-col'>Username</td>
        <td className='profile-user-details-right-col'>{username}</td>
      </tr>
      <tr>
        <td className='profile-user-details-left-col'>Phone Number</td>
        <td className='profile-user-details-right-col'>{phoneNumber}</td>
      </tr>
      <tr>
        <td className='profile-user-details-left-col'>Email</td>
        <td className='profile-user-details-right-col'>{email}</td>
      </tr>
        <td className='profile-user-details-left-col'>Spotify Link</td>
        <td className='profile-user-details-right-col'>{link}</td>
      <tr>

      </tr>
    </table>
  )
}

function UserActions({loggedInUser, profilePageUser}) {
  const followUser = () => {
    alert();
  }
  if (loggedInUser == profilePageUser) {
    return (
      <div className='profile-user-actions'>
        <a href="/edit-account"><button className='user-actions-edit-account'> Edit Profile </button></a>
      </div>
    )
    } else {
      return (
        <div className='profile-user-actions'>
        <button className='user-actions-edit-account' onClick={() => followUser()}> Follow User </button>
      </div>
    )
  }
}

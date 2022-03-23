import React, { useState, useEffect } from 'react';
import './trending-music.css';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar'

Modal.setAppElement(document.getElementById('root'));

export default function TrendingMusic() {
  const [profilePictureURL, setProfilePictureURL] = useState("https://180dc.org/wp-content/uploads/2017/11/profile-placeholder.png")
  const [userData, setUserData] = useState({
    email: ""
  });
  const [pageErr, updatePageErr] = useState(null);

  const navigate = useNavigate();
  const params = useParams();

 useEffect(() => {
    // if (!localStorage.getItem("auth_token")) {
    //   navigate("/login");
    // }
  }, [])

  useEffect(function() {
    // fetch("http://localhost:5000/trending_music", {
    //   method: "POST",
    //   headers: {
    //     username: params.id,
    //     profile_user: localStorage.getItem("username"),
    //     auth_token: localStorage.getItem("auth_token")
    //   },
    // }).then(response => {
    //   console.log("hit")
    //   if (response.status !== 200) {
    //     updatePageErr("could not reach backend");
    //     return null;
    //   }
    //   return response.json()
    // }).then(data => {
    //   console.log(data)
    // }).catch(err => {
    //   updatePageErr(err);
    // })
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
      <div className='trending-music-container'>
        <TrendingSong />
        <TrendingSong />
        <TrendingSong />
        <TrendingSong />
      </div>
    </div>
  )
}

function TrendingSong() {
  return (
    <div className='trending-song'>
      <div className='trending-song-album-cover'>
        <img
          src='https://upload.wikimedia.org/wikipedia/en/7/70/Graduation_%28album%29.jpg'
          className='trending-song-album-cover-img'
        />
      </div>
      <div className='trending-song-details'>
        <h1 className='trending-song-title'>Stronger</h1>
        <h3 className='trending-song-subtitle'>Ye</h3>
        <h3 className='trending-song-subtitle'>Graduation (2015)</h3>
        <h3 className='trending-song-subtitle'>95% liked, 5% disliked</h3>
      </div>
      <div className='trending-song-play-options-container'>
        <button className='play-btn'>Listen Now on Spotify</button>
        <br /><br />
        <button className='play-btn'>Listen Now on SoundCloud</button>
      </div>
    </div>
  );
}
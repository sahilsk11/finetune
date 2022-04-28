import React, { useState, useEffect } from 'react';
import './trending-music.css';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar'
import MusicPost from '../MusicPost/MusicPost';

Modal.setAppElement(document.getElementById('root'));

export default function TrendingMusic() {
  const [profilePictureURL, setProfilePictureURL] = useState("https://180dc.org/wp-content/uploads/2017/11/profile-placeholder.png")
  const [userData, setUserData] = useState({
    email: ""
  });
  const [pageErr, updatePageErr] = useState(null);
  const [posts, updatePosts] = useState([]);
  const [numSongs, setNumSongs] = useState(5);



  const API_URL = "http://127.0.0.1:5000"



  const navigate = useNavigate();
  const params = useParams();

 useEffect(() => {
    if (!localStorage.getItem("auth_token")) {
      navigate("/login");
    }
  }, [])


  useEffect(function() {
    fetch("http://localhost:5000/get_trending_songs", {
      method: "POST",
      headers: {
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        number_of_songs: numSongs
      },
    }).then(response => {
      console.log("hit")
      if (response.status !== 200) {
        updatePageErr("could not reach backend");
        return null;
      }
      return response.json()
    }).then(data => {
      console.log(data)
      let tmpPosts = [];
      data.forEach(post => {
        let host = "http://localhost:5000"
        let path = "/image/"
        let filename = post.image
        const imgSrc = host + path + filename
        console.log(imgSrc)
        tmpPosts.push(
          <MusicPost
            username={post.username}
            song_title={post.song_title}
            description={post.description}
            image={imgSrc}
            date_created={post.date_created}
            likes={post.likes}
            dislikes={post.dislikes}
            genre={post.genre}
            post_id={post.post_id}
            audio={post.audio}
          />
        );
      })
      updatePosts(tmpPosts);
    }).catch(err => {
      updatePageErr(err);
    })
  }, [numSongs]);

  useEffect(function() {
    if (pageErr != null) {
      alert(pageErr);
    }
  }, [pageErr]);

  function handleSelectChange(e) {
    const numPosts = e.target.value;
    //TODO call backend to retrieve new number of posts
  }

  return (
    <div>
      {NavBar()}
      <br/>
        <h5 className="feed-subtitle">
          Trending Music
        </h5>
        <label style={{marginLeft: "90px"}}>Choose number of trending songs...</label><br />
        <select style={{marginLeft: "90px"}} className="feed-select" onChange={handleSelectChange}>
          <option value="house">5</option>
          <option value="techno">10</option>
          <option value="15">15</option>
        </select>
      <div className='trending-music-container'>
       {posts}
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

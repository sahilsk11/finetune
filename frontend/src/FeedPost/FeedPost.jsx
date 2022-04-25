/* eslint-disable jsx-a11y/alt-text */
import React, { useRef,useState, useEffect } from 'react';
import '../Feed/feed.css';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar'
import ReactAudioPlayer from 'react-audio-player';

export default function Feedpost({username,
  song_title,
  description,
  image,
  date_created,
  likes,
  audio,
  dislikes,
  genre,
  post_id,
  }) {

    const [isLiked, updateLiked] = useState(false);

    useEffect(() => {
      fetch("http://localhost:5000/get_liked_posts_by_user", {
        method: "POST",
        headers: {
          username: localStorage.getItem("username"),
          auth_token: localStorage.getItem("auth_token")
        },
      }).then(response => {
        return response.json()
      }).then(data => {
        data.forEach(e => {
          if (e.post_id == post_id) {
            updateLiked(true);
          }
        })
      }).catch(err => {
        alert(err);
      })
    }, [isLiked]);

    function likePost(e) {
      e.preventDefault();
      e.currentTarget.classList.toggle('liked');

      fetch("http://localhost:5000/vote", {
        method: "POST",
        headers: {
          username: localStorage.getItem("username"),
          auth_token: localStorage.getItem("auth_token"),
          post_id: post_id,
          liked: !isLiked
        },
      }).then(response => {
        return response.json()
      }).then(data => {
        console.log(data)
      }).catch(err => {
        alert(err);
      })
    }

    function savePost(e) {
      e.preventDefault();
      fetch("http://localhost:5000/bookmark_post_user", {
        method: "POST",
        headers: {
          username: localStorage.getItem("username"),
          auth_token: localStorage.getItem("auth_token"),
          post_id: post_id,
        },
      }).then(response => {
        if(response.status == 200) {

        }
        return response.json()
      }).then(data => {
        console.log(data)
        if(data === "success") {
          alert("Post saved!")
        }
      }).catch(err => {
        alert(err);
      })

    }

    let classes = "like-button";
    if (isLiked) {
      classes += " liked"
    }

    let host = "http://localhost:5000"
    let path = "/image/"
    let filename = image
    const imgSrc = host + path + filename

    let audioHost = "http://localhost:5000"
    let audioPath = "/image/"
    let audioFileName = audio
    const audioSrc = audioHost + audioPath + audioFileName
  return (
    <div className='trending-song'>
      <div className='trending-song-album-cover'>
        <img
          src={imgSrc}
          className='trending-song-album-cover-img'
        />
      </div>
      <div className='trending-song-details'>
        <h1 className='trending-song-title'>{song_title}</h1>
        <h3 className='trending-song-subtitle'>{username}</h3>
        <h3 className='trending-song-subtitle'>{description}</h3>
        <h3 className='trending-song-subtitle'>Genre: {genre}</h3>
        <h3 className='trending-song-subtitle'>{likes} people liked this song</h3>
      </div>
      <div className='trending-song-play-options-container'>

      <br/>
      <div className="center-audio">
          <ReactAudioPlayer
            src={audioSrc}
            controls
          />
          </div>
      <a href={"/profile/" + username}><button className='play-btn'>View Artist</button></a>
      <button onClick={savePost} className='play-btn'>Save Post</button>
      <button onClick={likePost} class="like-button"></button>
    
      </div>
    </div>
  );
}

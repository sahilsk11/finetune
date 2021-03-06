import React, { Link, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar'
import ImageUploader from 'react-images-upload';

import './create-post.css';


export default function CreatePost() {

  const [songTitle, setSongTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [genre, setGenre] = useState("rock")
  const [audio, setAudio] = useState(null)

  const API_URL = "http://127.0.0.1:5000"

  function handleTitleChange(e) {
    setSongTitle(e.target.value)
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value)
  }

  function handleGenreChange(e) {
    setGenre(e.target.value)
  }

  function handleAudioChange(e) {
    setAudio(e.target.files[0])
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('audio', audio, audio.name);
    const lastImg = image[image.length - 1];
    formData.append('image', lastImg, lastImg.name);
    const requestOptions = {
      method: "POST",
      headers: {
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        song_title: songTitle,
        description: description,
        genre: genre,
      },
      body: formData
    };
    fetch(API_URL + "/create_post", requestOptions)
      .then(resp => {
        if(resp.status !== 200) {
          alert(resp.status)
        }
        return resp.json();
      })
      .then(data => {
        if(data === "failed") {
          alert("server could not email")
        }
        alert("Post Created!")
      })
  }


  return(
    <div style={{alignItems: "center"}}>
      {NavBar()}
      <h1 style={{color: "beige"}} className="create-account-title">
        Create Post
      </h1>
      <div className='profile-container'>
        <form onSubmit={handleSubmit}>
          <label>
            Song Title:
            <input className='edit-text-box' type="text" id="title" onChange={handleTitleChange} value={songTitle} /><br />
          </label>
          <label>
            Description:
            <input className='edit-text-box' type="text" id="description" onChange={handleDescriptionChange} value={description} /><br />
          </label>
          <label>
            Genre:
            <select className='genre-select' value={genre} onChange={handleGenreChange}>
              <option value="rock">Rock</option>
              <option value="house">House</option>
              <option value="techno">Techno</option>
              <option value="pop">Pop</option>
              <option value="alternative rock">Alternative Rock</option>
              <option value="rnb">RnB</option>
              <option value="trap">Trap</option>
              <option value="hiphop">Hiphop</option>
              <option value="deep house">Deep House</option>
              <option value="melodic techno">Melodic Techno</option>
              <option value="progressive house">Progressive House</option>
            </select><br />
          </label>
          <label>
            Song Audio:
            <input className='file-upload' type="file" onChange={handleAudioChange} />
          </label>
          <br/>
          <br/>
          <div className="center-sub">
          <ImageUploader
               withIcon={true}
               imgExtension={['.jpg', 'jpeg', '.gif', '.png', '.gif']}
               maxFileSize={10000000}
               buttonText='Add post photo'
               className="post-image-upload"
               onChange={setImage}
          />
          </div>
          <div className='submit-container'>
            <input className='create-submit-button' type="submit" value="Submit" />
          </div>
        </form>
      </div>
    </div>
  )


}

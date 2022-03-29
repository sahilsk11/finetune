import React, { useState, useEffect } from 'react';
import './music-post.css';
import ReactAudioPlayer from 'react-audio-player';
import ImageUploader from 'react-images-upload';
import Modal from 'react-modal';

export default function MusicPost({username,
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

    const [deleteModalOpen, setDeleteModal] = useState(false);
    const API_URL = "http://127.0.0.1:5000"
    const [new_description, setNewDescription] = useState("");
  const [new_genre, setNewGenre] = useState("rock")
  const [new_image, saveNewImage] = useState(null);


  function openDeleteModal() {
    setDeleteModal(true);
  }

  function closeDeleteModal() {
    setDeleteModal(false);
  }

  function handleDescriptionChange(e) {
    setNewDescription(e.target.value)
  }

  function handleGenreChange(e) {
    setNewGenre(e.target.value)
  }

  function edit() {
    console.log("editing post");
    const formData = new FormData();
    const lastImg = new_image[new_image.length - 1];
    formData.append('image', lastImg, lastImg.name);
    const requestOptions = {
      method: "POST",
      headers: {
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        description: new_description,
        song_title: song_title,
        genre: new_genre,
      },
      body: formData
    };
    fetch(API_URL + "/edit_post", requestOptions)
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
        alert("Post Edited!")
      })
  }


    const handleClick= (e) => {
      e.preventDefault();
      e.currentTarget.classList.toggle('liked');
    }

  let host = "http://localhost:5000"
  let path = "/image/"
  let filename = audio
  const audioSrc = host + path + filename

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

  let classes = "like-button";
  if (isLiked) {
    classes += " liked"
  }


  return (
    <div className='trending-song'>
      <div className='trending-song-album-cover'>
        <img
          src={image}
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
      <button className='play-btn'>Save Post</button>
      <button onClick={likePost} class={classes}></button>

      <button onClick={openDeleteModal} className='play-btn'>Edit Post</button>
     
     
     <Modal
              isOpen={deleteModalOpen}
              onRequestClose={closeDeleteModal}
              contentLabel="Delete Account"
              className='delete-modal'
            >
              <div style={{alignItems: "center"}}>
        <h1 style={{color: "black"}} className="create-account-title">
        Edit Post
        </h1>
        <div className='edit-container'>
        <form onSubmit={edit}>
        <div className='edit-profile-form-div'>
        
            <label>
              Edit description:
              <input className='edit-text-box'  onChange={handleDescriptionChange} value={new_description} /><br />
            </label>
           
          <label>
             
            Change Genre:
            <select className='genre-select' value={new_genre} onChange={handleGenreChange}>
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

        </div>
       <ImageUploader
            withIcon={true}
            imgExtension={['.jpg', 'jpeg', '.gif', '.png', '.gif']}
            maxFileSize={10000000}
            buttonText='Update your post photo'
            className="profile-pic-upload"
            onChange={saveNewImage}
          />
          <div className='submit-container'>
            <input className='create-submit-button' type="submit" value="Submit" />
          </div>
          </form>

      </div>
        </div>
              <button className='modal-delete-button' onClick={closeDeleteModal}>Cancel</button>
            </Modal>
      </div>
    </div>
  );
}
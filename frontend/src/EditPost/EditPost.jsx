import React, { useState, useEffect } from 'react';
import './edit-post.css';
import logo from './logo.png';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar'
import ImageUploader from 'react-images-upload';


export default function EditPost(Song) {
  const [image, saveImage] = useState(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [description, setDescription] = useState("");
  const [newUsername, setNewUsername] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [songTitle, setSongTitle] = useState("")

  const [spotify, setNewSpotify] = useState(null);
  const API_URL = "http://127.0.0.1:5000";
  const [genre, setGenre] = useState("rock")


  useEffect(() => {
    if (!localStorage.getItem("auth_token")) {
      navigate("/login");
    }
  }, [])

//   useEffect(() => {
//     if (image !== null && image.length > 0) {
//       const formData = new FormData();
//       const lastImg = image[image.length - 1];
//       formData.append('image', lastImg, lastImg.name);
//       fetch("http://localhost:5000/update_profile_photo/", {
//       method: "POST",
//       headers: {
//         username: localStorage.getItem("username"),
//         auth_token: localStorage.getItem("auth_token")
//       },
//       body: formData
//       }).then(response => response.json()).then(data => {
//       console.log(data);
//       });
//     }
//   }, [image]);

//   useEffect(() => {
//     fetch(API_URL + "/get_profile_page", {
//       method: "POST",
//       headers: {
//         username: localStorage.getItem("username"),
//         profile_user: localStorage.getItem("username"),
//         auth_token: localStorage.getItem("auth_token"),
//       },
//     }).then(response => {
//       if (response.status !== 200) {
//         return null;
//       }
//       return response.json()
//     }).then(data => {
//       if (data != null ) {
//         setEmail(data.email);
//         setPhoneNumber(data.phone_number)
//         setUsername(data.username)
//         setNewUsername(data.username)
//         setNewSpotify(data.spotify)
//       }
//     }).catch(err => {
//       alert("could not fetch user data")
//     })
//   }, [])

  

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    const lastImg = image[image.length - 1];
    formData.append('image', lastImg, lastImg.name);
    const requestOptions = {
      method: "POST",
      headers: {
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        description: description,
        song_title: songTitle,
        genre: genre,
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

  

  
  function handleTitleChange(e) {
    setSongTitle(e.target.value)
  }


  function handleDescriptionChange(e) {
    setDescription(e.target.value)
  }

  function handleGenreChange(e) {
    setGenre(e.target.value)
  }


    return (
      <div style={{alignItems: "center"}}>
        {NavBar()}
        <h1 style={{color: "beige"}} className="create-account-title">
        Edit Post
        </h1>
        <div className='profile-container'>
        <p style={{textAlign:"center", margin: "0px" }}><img src={logo} alt="Logo"/></p>
        <form onSubmit={handleSubmit}>
        <div className='edit-profile-form-div'>
        <label>
            Enter Song to be Edited:
            <input className='edit-text-box' type="text" id="title" onChange={handleTitleChange} value={songTitle} /><br />
          </label>  
            <label>
              Edit description:
              <input className='edit-text-box'  onChange={handleDescriptionChange} value={description} /><br />
            </label>
           
          <label>
              <br/><br/>
            Change Genre:
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

        </div>
       <ImageUploader
            withIcon={true}
            imgExtension={['.jpg', 'jpeg', '.gif', '.png', '.gif']}
            maxFileSize={10000000}
            buttonText='Update your post photo'
            className="profile-pic-upload"
            onChange={saveImage}
          />
          <div className='submit-container'>
            <input className='create-submit-button' type="submit" value="Submit" />
          </div>
          </form>

      </div>
        </div>

    )
  }

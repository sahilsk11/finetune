import React, { useState, useEffect } from 'react';
import './profile.css';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar'
import ReactAudioPlayer from 'react-audio-player';
import ImageUploader from 'react-images-upload';
import logo from './logo.png';

Modal.setAppElement(document.getElementById('root'));


export default function Profile(props) {
  const [profilePictureURL, setProfilePictureURL] = useState("https://180dc.org/wp-content/uploads/2017/11/profile-placeholder.png")
  const [userData, setUserData] = useState({
    email: ""
  });
  const [pageErr, updatePageErr] = useState(null);

  const navigate = useNavigate();
  const params = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = "http://127.0.0.1:5000"
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("rock")
  const [image, saveImage] = useState(null);
  const [deleteModalOpen, setDeleteModal] = useState(false);

  function openDeleteModal() {
    setDeleteModal(true);
  }

  function closeDeleteModal() {
    setDeleteModal(false);
  }


  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
        username: localStorage.getItem("username"),
      }
    };
    fetch(API_URL + "/user_posts", requestOptions)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        console.log("get  post request back is: ", data);
        console.log(data);
        if (data !== "failed") {
          setPosts(data.sort((a,b)=>b.post_id-a.post_id));
          setError(null);
        } else {
          //alert(data);
          setError(data);
        }
      })
      .catch(err => {
        setLoading(false)
        console.log("can not get  posts: " + err);
        setError("Can not connect to server!");
      });

    }, [])


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
          console.log(data.image)
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
    <br/>
    <h5 className="feed-subtitle">
        My Posts
      </h5>
    {posts.map(post => {
          let host = "http://localhost:5000"
          let path = "/image/"
          let filename = post.image
          const imgSrc = host + path + filename
          return (
              <ProfilePosts
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
          )}
        )}
    </div>
  )
}

function ProfilePosts({username,
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

    const handleClick= (e) => {
      e.preventDefault();
      e.currentTarget.classList.toggle('liked');
    }

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

  function edit(song) {
    console.log("editing post");
    const formData = new FormData();
    const lastImg = new_image[image.length - 1];
    formData.append('image', lastImg, lastImg.name);
    const requestOptions = {
      method: "POST",
      headers: {
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        description: new_description,
        song_title: song,
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

  let host = "http://localhost:5000"
  let path = "/image/"
  let filename = audio
  const audioSrc = host + path + filename
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
      <button onClick={handleClick} class="like-button"></button>
     <button onClick={openDeleteModal} className='play-btn'>Edit Post</button>
     
     
     <Modal
              isOpen={deleteModalOpen}
              onRequestClose={closeDeleteModal}
              contentLabel="Delete Account"
              className='delete-modal'
            >
              <div style={{alignItems: "center"}}>
        <h1 style={{color: "beige"}} className="create-account-title">
        Edit Post
        </h1>
        <div className='profile-container'>
        <form onSubmit={edit}>
        <div className='edit-profile-form-div'>
        
            <label>
              Edit description:
              <input className='edit-text-box'  onChange={handleDescriptionChange} value={description} /><br />
            </label>
           
          <label>
             
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

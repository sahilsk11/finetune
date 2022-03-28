import React, { useState, useEffect } from 'react';
import './profile.css';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar'
import ReactAudioPlayer from 'react-audio-player';

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
    const [isLiked, updateLiked] = useState(false);


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

import React, { useState, useEffect } from 'react';
import './profile.css';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar'
import ReactAudioPlayer from 'react-audio-player';
import ImageUploader from 'react-images-upload';
import logo from './logo.png';

import MusicPost from '../MusicPost/MusicPost';

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
        username: params.id,
      }
    };
    fetch(API_URL + "/user_posts", requestOptions)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        console.log("get  post request back is: ", data);
        console.log(data);
        if (data !== "failed") {
          setPosts(data.sort((a, b) => b.post_id - a.post_id));
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

  useEffect(function () {
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
      if (data != null) {
        if (data.image !== null && data.image !== "") {
          let host = "http://localhost:5000"
          let path = "/image/"
          let filename = data.image
          console.log(data.image)
          setProfilePictureURL(host + path + filename)
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


  useEffect(function () {
    if (pageErr != null) {
      alert(pageErr);
    }
  }, [pageErr]);

  const userPosts = posts.map(post => {
    let host = "http://localhost:5000"
    let path = "/image/"
    let filename = post.image
    const imgSrc = host + path + filename
    return (
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
    )
  }
  )



  return (
    <div>
      {NavBar()}
      <br />
      <div className='profile-container'>
        <div className='profile-picture-container'>
          <ProfilePicture imageSrc={profilePictureURL} />
        </div>

        <div className='profile-user-details-container'>
          <UserDetails userData={userData} />
        </div>
        <div className='user-actions-container'>
          <UserActions loggedInUser={localStorage.getItem("username")} profilePageUser={params.id} />
        </div>

      </div>
      <br />
      <h5 className="feed-subtitle">
        My Posts
      </h5>
      {userPosts}
    </div>
  )
}

function ProfilePicture({ imageSrc }) {
  return (
    <img
      src={imageSrc}
      alt={"profile picture"}
      className='profile-picture'
    />
  )
}


function UserDetails({ userData }) {
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
      <tr>
        <td className='profile-user-details-left-col'>Spotify Link</td>
        <td className='profile-user-details-right-col'>{link}</td>
      </tr>
      <br /> <br />

      <FollowerBlock />

    </table>

  )
}

function FollowerBlock() {
  const [followers, updateFollowers] = useState([]);
  const [following, updateFollowing] = useState([]);
  const [modal1IsOpen, set1IsOpen] = useState(false);
  const [modal2IsOpen, set2IsOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/get_user_follows", {
      method: "GET",
      headers: {
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token")
      },
    }).then(response => {
      if (response.status !== 200) {
        return null;
      }
      return response.json()
    }).then(data => {
      updateFollowing(data);
    })
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/get_user_followers", {
      method: "GET",
      headers: {
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token")
      },
    }).then(response => {
      if (response.status !== 200) {
        return null;
      }
      return response.json()
    }).then(data => {
      updateFollowers(data);
    })
  }, []);

  function closeModal1() {
    console.log("here")
    set1IsOpen(false);
  }
  function closeModal2() {
    console.log("here")
    set2IsOpen(false);
  }

  let followerElements = [];
  let followingElements = [];


  let numFollowers = 0;
  if (followers !== null) {
    followers.forEach(f => {
      followerElements.push(
        <Follower name={f} />
      )
    })
    numFollowers = followers.length;
  }
  const text = numFollowers.toString() + " followers";

  let numFollowing = 0;
  if (following !== null) {
    following.forEach(f => {
      followingElements.push(
        <Follower name={f} />
      )
    })
    numFollowers = following.length;
  }
  const text1 = numFollowing.toString() + " following";

  return (
    <tr>
      <td className='profile-user-details-left-col'><a href="#" onClick={() => { set1IsOpen(true) }}>{text}</a></td>
      <td className='profile-user-details-right-col'><a href="#" onClick={() => { set2IsOpen(true) }}>{text1}</a></td>
      <Modal
        isOpen={modal1IsOpen}
        onRequestClose={closeModal1}
        style={{
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: "50%",
        }}
        contentLabel="Example Modal"
      >
        {/* <button onClick={closeModal1}>close</button> */}
        {followerElements}
      </Modal>

      <Modal
        isOpen={modal2IsOpen}
        onRequestClose={closeModal2}
        style={{
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: "50%",
        }}
        contentLabel="Example Modal"
      >
        {/* <button onClick={closeModal2}>close</button> */}
        {followingElements}
      </Modal>
    </tr>
  )
}

function namesToP(names) {
  let x = [];
  names.forEach(n => {

  })
  return x;
}

function Follower({name}) {
  return (
		<div style={{
			backgroundColor: "white",
			padding: "20px",
      borderBottom: "1px solid black"
		}}>
			<h3><a href={"/profile/"+name} style={{textDecoration:"none"}}>{name} </a></h3>
		</div>
	)
}

function UserActions({ loggedInUser, profilePageUser }) {
  const [followsUser, updateFollowsUsers] = useState(false);
  const [blocksUser, updateBlocksUsers] = useState(false);

  const followUser = () => {
    let host = "http://localhost:5000";
    if (followsUser) {
      host += "/unfollow_user"
    } else {
      host += "/follow_user"
    }
    fetch(host, {
      method: "POST",
      headers: {
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        user_to_follow: profilePageUser,
        user_to_unfollow: profilePageUser,
      },
    }).then(response => {
      if (response.status !== 200) {
        return null;
      }
      return response.json()
    }).then(data => {
      if (data === true) {
        updateFollowsUsers(!followsUser);
      }
    })
  }

  const blockUser = () => {
    const isBlocked = !blocksUser;
    updateBlocksUsers(isBlocked)
    //TODO make request to block user
    let host = "http://localhost:5000";
    if (blocksUser) {
      host += "/block"
    } else {
      host += "/block"
    }
    fetch(host, {
      method: "GET",
      headers: {
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        blocked_user: profilePageUser,
        blocked_user: profilePageUser,
      },
    }).then(response => {
      if (response.status !== 200) {
        return null;
      }
      return response.json()
    }).then(data => {
      if (data === true) {
        updateBlocksUsers(!blocksUser);
      }
    })
  }

  const reportUser = () => {
    if (window.confirm("Are you sure you want to flag this user for inappropriate account use?")) {
      fetch("http://localhost:5000/report_user", {
        method: "POST",
        headers: {
          user_who_reported: localStorage.getItem("username"),
          user_to_report: profilePageUser,
          auth_token: localStorage.getItem("auth_token"),
          report_reason: "default"
        },
      }).then(response => {
        if (response.status !== 200) {
          return null;
        }
        return response.json()
      }).then(data => {
        if (data === null || data === []) {
          return
        }
        alert("User reported.")
      })
    }
  }

  useEffect(() => {
    fetch("http://localhost:5000/get_user_follows", {
      method: "GET",
      headers: {
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token")
      },
    }).then(response => {
      if (response.status !== 200) {
        return null;
      }
      return response.json()
    }).then(data => {
      if (data === null || data === []) {
        return
      }
      data.forEach(e => {
        if (e === profilePageUser) {
          updateFollowsUsers(true);
        }
      })
    })
  }, [followsUser]);

  //TODO useEffect function to see if user is already blocked or not
  useEffect(() => {
    fetch("http://localhost:5000/fetch_blocked_list", {
      method: "GET",
      headers: {
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token")
      },
    }).then(response => {
      if (response.status !== 200) {
        return null;
      }
      return response.json()
    }).then(data => {
      if (data === null || data === []) {
        return
      }
      data.forEach(e => {
        if (e === profilePageUser) {
          updateBlocksUsers(true);
        }
      })
    })
  }, [blocksUser])

  const text = followsUser ? "Unfollow User" : "Follow User";

  const blockText = blocksUser ? "Unblock User" : "Block User";

  if (loggedInUser == profilePageUser) {
    return (
      <div className='profile-user-actions'>
        <a href="/edit-account"><button className='user-actions-edit-account'> Edit Profile </button></a>
      </div>
    )
  } else {
    return (
      <div className='profile-user-actions'>
        <button className='user-actions-edit-account' onClick={() => followUser()}> {text} </button>
        <button style={{ marginTop: "15px" }} className='user-actions-edit-account' onClick={() => blockUser()}>{blockText}</button>
        <button style={{ marginTop: "15px", marginBottom: "30px" }} className='user-actions-edit-account' onClick={() => reportUser()}>Report User</button>
      </div>
    )
  }
}
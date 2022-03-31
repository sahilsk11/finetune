/* eslint-disable jsx-a11y/alt-text */
import React, { useRef,useState, useEffect } from 'react';
import './feed.css';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar'
import ReactAudioPlayer from 'react-audio-player';
import FeedPost from '../FeedPost/FeedPost';



Modal.setAppElement(document.getElementById('root'));

export default function Feed() {
  const [profilePictureURL, setProfilePictureURL] = useState("https://180dc.org/wp-content/uploads/2017/11/profile-placeholder.png")
  const [userData, setUserData] = useState({
    email: ""
  });
  const [pageErr, updatePageErr] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  // references
  const audioPlayer = useRef();   // reference our audio component
  const progressBar = useRef();   // reference our progress bar
  const animationRef = useRef();  // reference the animation


  const API_URL = "http://127.0.0.1:5000"



  const navigate = useNavigate();
  const params = useParams();

  /* audio player*/



 /* getting posts */
  useEffect(() => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      auth_token: localStorage.getItem("auth_token"),
      username: localStorage.getItem("username"),
    }
  };
  fetch(API_URL + "/view_feed", requestOptions)
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

  function displayMyFeed() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
        username: localStorage.getItem("username"),
      }
    };
    fetch(API_URL + "/view_feed", requestOptions)
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
  }

  function displaySavedPosts() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
        username: localStorage.getItem("username"),
        profile_user: localStorage.getItem("username")
      }
    };
    fetch(API_URL + "/all_saved_posts", requestOptions)
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
  }

  function displayGenrePosts(genre) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
        username: localStorage.getItem("username"),
        genre: genre
      }
    };
    fetch(API_URL + "/songs_by_genre", requestOptions)
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
  }

  function handleSelectChange(e) {
    const selection = e.target.value;

    if(selection === "feed") {
      displayMyFeed();
    } else if(selection === "saved") {
      displaySavedPosts();
    } else {
      displayGenrePosts(selection);
    }
  }



  return (
    <div>
      {NavBar()}
      <br/>
      <div className='trending-music-container'>
      <h5 className="feed-subtitle">
        Feed
      </h5>
      <select className="feed-select" onChange={handleSelectChange}>
        <option selected value="feed">My Feed</option>
        <option value="saved">Saved Posts</option>
        <option value="house">Songs by Genre: House</option>
        <option value="techno">Songs by Genre: Techno</option>
        <option value="pop">Songs by Genre: Pop</option>
        <option value="rock">Songs by Genre: Rock</option>
        <option value="alternative rock">Songs by Genre: Alternative Rock</option>
        <option value="rnb">Songs by Genre: RnB</option>
        <option value="trap">Songs by Genre: Trap</option>
        <option value="hiphop">Songs by Genre: Hip Hop</option>
        <option value="deep house">Songs by Genre: Deep House</option>
        <option value="melodic techno">Songs by Genre: Melodic Techno</option>
        <option value="progressive house">Songs by Genre: Progressive House</option>
      </select>
            {posts.length === 0 ? <h4>No posts yet...</h4> : null}

            {posts.map(post => (
              <FeedPost
                username={post.username}
                song_title={post.song_title}
                description={post.description}
                image={post.image}
                date_created={post.date_created}
                likes={post.likes}
                dislikes={post.dislikes}
                genre={post.genre}
                post_id={post.post_id}
                audio={post.audio}
              />
            ))}


      </div>
    </div>
  )
}

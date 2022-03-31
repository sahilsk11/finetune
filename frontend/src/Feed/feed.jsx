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



  return (
    <div>
      {NavBar()}
      <br/>
      <div className='trending-music-container'>
      <h5 className="feed-subtitle">
        Feed
      </h5>
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

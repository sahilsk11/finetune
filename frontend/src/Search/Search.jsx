import React, { useState, useEffect } from 'react';
import "./search.css";
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar';
import MusicPost from '../MusicPost/MusicPost';


export default function Search() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("Song")
  const [results, setResults] = useState(null)
  const API_URL = "http://127.0.0.1:5000";


  function handleTextChange(e) {
    setSearchTerm(e.target.value)
  }

  function handleRadioChange(e) {
    setSearchType(e.target.value)
  }

  let songPosts = results ? (results.map(post => {
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
)) : null;


  function handleSubmit(e) {
    e.preventDefault()
    console.log("searching")
    if(searchType === "Song") {
      fetch(API_URL + "/search_song", {
        method: "POST",
        headers: {
          username: localStorage.getItem("username"),
          auth_token: localStorage.getItem("auth_token"),
          song_name: searchTerm,
        },
      }).then(response => {
        if (response.status !== 200) {
          alert("Error retrieving song")
          return null;
        }
        return response.json()
      }).then(data => {
        if (data != null ) {
          console.log(data)
          setResults(data)
        }
      }).catch(err => {
        alert("could not fetch user data")
      })
    } else {
      fetch(API_URL + "/search_for_user", {
        method: "POST",
        headers: {
          username: localStorage.getItem("username"),
          auth_token: localStorage.getItem("auth_token"),
        },
      }).then(response => {
        if (response.status !== 200) {
          console.log(response)
          alert("Error retrieving user")
          return null;
        }
        return response.json()
      }).then(data => {
        if (data != null ) {
          console.log(data)
          setResults(data)
        }
      }).catch(err => {
        alert("could not fetch user data")
      })
    }
  }
  return(
    <div style={{alignItems: "center"}}>
      {NavBar()}
      <h1 style={{color: "beige"}} className="create-account-title">
        Search
      </h1>
      <div className='search-text-container'>
        <form style={{color: "beige" }} className="search-form" onSubmit={handleSubmit}>
          <input className="search-textbox" type="text" onChange={handleTextChange} value={searchTerm} />
          <div className="center">Search by: </div>
          <div className="center2">
          <input type="radio" onClick={handleRadioChange} value="Song" checked name="search-type" />Song
          <input type="radio" onClick={handleRadioChange} value="User" name="search-type" />User
          </div>
          <input className="search-submit" type="submit" value="Search"/>
        </form>
      </div>
      {songPosts}
    </div>
  )
}

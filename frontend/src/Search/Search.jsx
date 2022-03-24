import React, { useState, useEffect } from 'react';
import "./search.css";
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar'


export default function Search() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("Song")
  const [results, setResults] = useState(null)

  function handleTextChange(e) {
    setSearchTerm(e.target.value)
  }

  function handleRadioChange(e) {
    setSearchType(e.target.value)
  }

  function handleSubmit(e) {
    console.log("searching")
  }
  return(
    <div style={{alignItems: "center"}}>
      {NavBar()}
      <h1 style={{color: "beige"}} className="create-account-title">
        Search
      </h1>
      <div className='search-text-container'>
        <form className="search-form" onSubmit={handleSubmit}>
          <input className="search-textbox" type="text" id="term" placeholder="Search song, user, or genre" onChange={handleTextChange} value={searchTerm} />
          Search by:
          <input type="radio" onClick={handleRadioChange} value="Song" checked name="search-type" />Song
          <input type="radio" onClick={handleRadioChange} value="User" name="search-type" />User
          <input type="radio" onClick={handleRadioChange} value="Genre" name="search-type" />Genre
          <input className="search-submit" type="submit" value="Search"/>
        </form>
      </div>
    </div>
  )
}

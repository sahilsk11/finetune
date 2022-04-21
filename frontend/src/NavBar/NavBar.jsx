import React, { useState, useEffect} from 'react';
import './navbar.css';
import logo2 from './logo2.png';


export function NavBar() {

	return (
<div>
<a href='/'><img className="imglogo" style={{ textAlign:"left", width:"10%", height:"auto", marginTop: "-2.5%" }} src={logo2} alt="Logo2"/></a>
<section className="navigation">
  <div className="nav-container">
    <div class="brand">

    </div>
    <nav>
      <div className="nav-mobile"><a id="nav-toggle" href="#!"><span></span></a></div>
      <ul className="nav-list">
        <li>
          <a href={'/profile/' + localStorage.getItem("username")}>Profile</a>
        </li>
				<li>
					<a href="/search">Search</a>
				</li>
        <li>
          <a href="/settings">Settings</a>
        </li>
				<div className="dropdown">
					<div>
        		<button className="dropbtn">
          		Feed
        		</button>
					</div>
					<div className="dropdown-content">
						<a href="/feed">My Feed</a>
						<a href="/trending-music">Trending Songs</a>
						<a href="/songs-by-genre">Posts by Genre</a>
						<a href="/saved-feed">Saved Posts</a>
						<a href="/liked-feed">Friend's Liked Songs</a>
					</div>
				</div>
				<li >
					<a style={{background: "rgb(95, 17, 10)", color: "beige"}} href="/create-post">Create Post</a>
				</li>
      </ul>
    </nav>
  </div>
</section>
</div>
	)
}

export default NavBar;

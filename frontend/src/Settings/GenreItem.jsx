import React, { useState, useEffect} from 'react';
import './settings.css';

function GenreItem(props) {

  const [isFollowing, setIsFollowing] = useState(false);
  //const genreTitle = props.genre.charAt(0).toUpperCase() + props.genre.slice(1);

  useEffect(() => {
    if(props.followedGenres.includes(props.genre)) {
      setIsFollowing(true)
    }
  })

  function handleClick() {
    let endpoint = isFollowing ? "/unfollow_genre" : "/follow_genre";
    setIsFollowing(!isFollowing)


    fetch("http://localhost:5000"+endpoint, {
      method: "POST",
      headers: {
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        genre: props.genre
      },
    }).then(response => {
      return response.json()
    }).then(data => {
      console.log(data)
    })
  }

  let text = isFollowing ? "Following" : "Follow";


  return(
    <div key={props.genre} className='genre-result'>
      {props.genre}
      <button onClick={handleClick} className='follow-genre-button'>{text}</button>
    </div>
  );
}

export default GenreItem;

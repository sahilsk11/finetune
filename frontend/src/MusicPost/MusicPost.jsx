import React, { useState, useEffect } from 'react';
import './music-post.css';
import ReactAudioPlayer from 'react-audio-player';
import ImageUploader from 'react-images-upload';
import Modal from 'react-modal';

export default function MusicPost({username,
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

    const [deleteModalOpen, setDeleteModal] = useState(false);
    const [addCommentsModalOpen, setAddCommentsModal] = useState(false);
    const [commentsModalOpen, setCommentsModal] = useState(false);


    const API_URL = "http://127.0.0.1:5000"
    const [new_description, setNewDescription] = useState("");
  const [new_genre, setNewGenre] = useState("rock")
  const [new_image, saveNewImage] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [isFetchingComments, setIsFetchingComments] = useState(true);


  function openCommentsModal() {
    setCommentsModal(true);
  }

  function closeCommentsModal() {
    setCommentsModal(false);
  }

  function openAddCommentsModal() {
    setAddCommentsModal(true);
  }

  function closeAddCommentsModal() {
    setAddCommentsModal(false);
  }

  function openDeleteModal() {
    setDeleteModal(true);
  }

  function closeDeleteModal() {
    setDeleteModal(false);
  }

  function handleCommentChange(e) {
    setComment(e.target.value)
  }

  function handleDescriptionChange(e) {
    setNewDescription(e.target.value)
  }

  function handleGenreChange(e) {
    setNewGenre(e.target.value)
  }

  useEffect(() => {
    const requestOptionsComments = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        post_id: post_id
      }
    };
    setIsFetchingComments(true)
      fetch(API_URL + "/get_commented_post_by_id", requestOptionsComments)
        .then(res => res.json())
        .then(data => {
          console.log("get comment request back is: ", data);
          console.log(data)
          setComments(data)
          console.log(data)
          setIsFetchingComments(false)
        })
        .catch(err => {
          console.log(err);
          setIsFetchingComments(false)
        });

      }, [])

   //comment
   function postComment() {
    setComment(comment.trim());
    if (comment === '') return;
    setSendingComment(true);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        post_id: post_id,
        comment: comment,
        profile_user: localStorage.getItem('username')
      }
    };

    fetch(API_URL + "/comment", requestOptions)
    .then(res => res.json())
    .then(data => {
      if (data === 'failed') {
        setErrorMessage('Could not perform the action.');
      } else {
        setComment('');
        setShowCommentBox(false);
        setComments([...comments])
      }
      setSendingComment(false);
      console.log(data)
    })
    .catch(err => {
      console.log(err);
      setSendingComment(false);
      setErrorMessage('Could not connect to the server');
    })
  }

  function Content({username,
    comment,
    date,
    }) {

    return (
        <div style={{marginBottom: "10px"}} className='edit-profile-form-div'>
        <h3 className='trending-song-subtitle1'>{username}</h3>
        <h3 className='trending-song-subtitle2'>{comment}</h3>
        <h3 className='trending-song-subtitle2'>{date}</h3>

    </div>


    )
    }

  const CommentPost = comments.map(com => {
    return (
      <Content
      username={com.username}
      comment = {com.comment}
      date={com.post_time}
      />
    )
  })



  function edit() {
    console.log("editing post");
    const formData = new FormData();
    const lastImg = new_image[new_image.length - 1];
    formData.append('image', lastImg, lastImg.name);
    const requestOptions = {
      method: "POST",
      headers: {
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        description: new_description,
        song_title: song_title,
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

  function deletePost(e) {
    if (window.confirm("Are you sure you want to delete this post?")) {
      fetch(API_URL + "/delete_only_post", {
        method: "GET",
        headers: {
          username: localStorage.getItem("username"),
          post_id: post_id,
          auth_token: localStorage.getItem("auth_token")
        },
      }).then(response => {
        if(response.status === 200) {
          return response.json()

        }
      }).then(data => {
        console.log(data)
        if(data === "success") {
          alert("Post Deleted!")
        }
      }).catch(err => {
        alert(err);
        alert("did not delete oops");
      })
      alert("Post Deleted!");
      window.location.reload();
    }
    }

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

  let modalClasses = "modal-hidden";
  if (username == localStorage.getItem("username")) {
    modalClasses = "";
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
      <button onClick={openAddCommentsModal} className='play-btn'>Add Comment</button>
      <button onClick={deletePost} className='play-btn'>Delete Post</button>
      <button onClick={openCommentsModal} className='play-btn'>View Comments</button>

      <button onClick={openDeleteModal} className={'play-btn '+modalClasses}>Edit Post</button>


      <Modal
              isOpen={commentsModalOpen}
              onRequestClose={closeCommentsModal}
              contentLabel="Add Comment"
              className='delete-modal'
            >


              <div style={{alignItems: "center"}}>
        <h1 style={{color: "black"}} className="create-account-title">
       Comments
        </h1>
        <div className='edit-container'>
       
        {CommentPost}
       
       </div>
        
        </div>
              <button className='modal-delete-button' onClick={closeCommentsModal}>Go back</button>
            </Modal>
     
      <Modal
              isOpen={addCommentsModalOpen}
              onRequestClose={closeAddCommentsModal}
              contentLabel="Add Comment"
              className='delete-modal'
            >
              <div style={{alignItems: "center"}}>
        <h1 style={{color: "black"}} className="create-account-title">
        Add Comment
        </h1>
        <div className='edit-container'>
        <form onSubmit={postComment}>
        <div className='edit-profile-form-div'>
        
            <label>
              Add  comment:
              <input className='edit-text-box'  onChange={handleCommentChange} value={comment} /><br />
            </label>
           
        

        </div>
          <div className='submit-container'>
            <input className='create-submit-button' type="submit" value="Submit" />
          </div>
          </form>

      </div>
        </div>
              <button className='modal-delete-button' onClick={closeAddCommentsModal}>Go back</button>
            </Modal>



     <Modal
              isOpen={deleteModalOpen}
              onRequestClose={closeDeleteModal}
              contentLabel="Delete Account"
              className='delete-modal'
            >
              <div style={{alignItems: "center"}}>
        <h1 style={{color: "black"}} className="create-account-title">
        Edit Post
        </h1>
        <div className='edit-container'>
        <form onSubmit={edit}>
        <div className='edit-profile-form-div'>
        
            <label>
              Edit description:
              <input className='edit-text-box'  onChange={handleDescriptionChange} value={new_description} /><br />
            </label>
           
          <label>
             
            Change Genre:
            <select className='genre-select' value={new_genre} onChange={handleGenreChange}>
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
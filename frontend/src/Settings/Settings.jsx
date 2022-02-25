import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';



import NavBar from "../NavBar/NavBar";


function Settings() {

  const navigate = useNavigate();

  const [deleteModalOpen, setDeleteModal] = useState(false);

  function openDeleteModal() {
    setDeleteModal(true);
  }

  function closeDeleteModal() {
    setDeleteModal(false);
  }

  function logout() {
    console.log("logging out")
    const logoutOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token")
      }
    }
    fetch(API_URL + "/logout", logoutOptions)
      .then(res => res.json())
      .then(data => {
        if(data !== "success") {
          alert("logout failed")
        }
      })
      .catch(err => {
        alert("server can't logout user")
      });
      localStorage.removeItem("auth_token");
      localStorage.removeItem("username");

      navigate("/login");
  }

  const API_URL = "http://127.0.0.1:5000";

  function handleDelete() {
    console.log("deleting user")
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token")
      }
    };

    fetch(API_URL + "/delete_user", requestOptions)
      .then(res => res.json())
      .then(data => {
        if (data !== "success") {
          alert("delete account failed!");
        }
      })
      .catch(err => {
        alert("server can not delete account " + err);
      });
      localStorage.removeItem("auth_token");
      localStorage.removeItem("username");

      navigate("/login");
    }

  return(
      <div style={{alignItems: "center"}}>
        <NavBar />
        <h1 style={{color: "beige"}} className="create-account-title">
          Settings
        </h1>
        <div className='profile-container'>
          <button onClick={logout} className='user-actions-edit-account'>
            Log out
          </button><br/><br/>
        <button onClick={openDeleteModal} className='user-actions-edit-account'>
            Delete Account
          </button><br/>
          <br/>
          <a href="/edit-account"><button className='user-actions-edit-account'> Edit Profile </button></a>
            <Modal
              isOpen={deleteModalOpen}
              onRequestClose={closeDeleteModal}
              contentLabel="Delete Account"
              className='delete-modal'
            >
              <h2>Are you sure?</h2>
              <button className='modal-delete-button' onClick={handleDelete}>Delete Account</button>
              <button className='modal-delete-button' onClick={closeDeleteModal}>Cancel</button>
            </Modal>
        </div>
      </div>
  )

}

export default Settings;

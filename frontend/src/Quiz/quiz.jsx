import React, { Link, useState, useEffect } from 'react';
import './quiz.css';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';


export default function Quiz() {

    const navigate = useNavigate();

    const handleClick = (e) => {
        if (localStorage.getItem("username")) {
            navigate("/profile/" + localStorage.getItem("username"));
        } else {
            navigate("/login");
        }
    }

    if (localStorage.getItem("username")) {
        navigate("/profile");
    }

    return (

        <div style={{ marginTop: "4%", alignItems: "center" }}>

            <h1 className="quiz-title">
                Welcome to FineTune! Here is a short questionare to get an idea of what kind of music you like!
            </h1>
            <p style={{ textAlign: "center" }}><img src={logo} alt="Logo" /></p>

            {/* <form className="form">
        <button onClick={handleClick}>Enter Finetune</button>
        </form> */}

            <h1 className="quiz-option">
                Select all the genres that you like!
            </h1>
            <form className="quiz" action="#">
                
                <p>
                    <input type="checkbox" id="test1"  />
                    <label for="test1">house</label>
                </p>
                <p>
                    <input type="checkbox" id="test2"  />
                    <label for="test2">techno</label>
                </p>
                <p>
                    <input type="checkbox" id="test3"  />
                    <label for="test3">pop</label>
                </p>
                <p>
                    <input type="checkbox" id="test4"  />
                    <label for="test4">alternative rock</label>
                </p>
                <p>
                    <input type="checkbox" id="test5"  />
                    <label for="test5">rnb</label>
                </p>
                <p>
                    <input type="checkbox" id="test6"  />
                    <label for="test6">trap</label>
                </p>
                <p>
                    <input type="checkbox" id="test7"  />
                    <label for="test7">hiphop</label>
                </p>
                <p>
                    <input type="checkbox" id="test8"  />
                    <label for="test8">deep house</label>
                </p>
                <p>
                    <input type="checkbox" id="test9"  />
                    <label for="test9">melodic technomelodic techno</label>
                </p>
                <p>
                    <input type="checkbox" id="test10"  />
                    <label for="test10">progressive house</label>
                </p>
                <button >Submit</button>
            </form>

          


        </div>


    )
}
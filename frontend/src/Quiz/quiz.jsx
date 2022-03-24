import React, { Link, useState, useEffect } from 'react';
import './quiz.css';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';


export default function Quiz() {

    const navigate = useNavigate();
    const[checked1, setChecked1] = useState(false);   
    const[checked2, setChecked2] = useState(false);   
    const[checked3, setChecked3] = useState(false);   
    const[checked4, setChecked4] = useState(false);   
    const[checked5, setChecked5] = useState(false);   
    const[checked6, setChecked6] = useState(false);   
    const[checked7, setChecked7] = useState(false);   
    const[checked8, setChecked8] = useState(false);   
    const[checked9, setChecked9] = useState(false);   
    const[checked10, setChecked10] = useState(false);   


    // const handleClick = (e) => {
    //     if (localStorage.getItem("username")) {
    //         navigate("/profile/" + localStorage.getItem("username"));
    //     } else {
    //         navigate("/login");
    //     }
    // }

    // if (localStorage.getItem("username")) {
    //     navigate("/profile");
    // }

    const handleChange1 = () => {
        setChecked1(!checked1);
      };
      const handleChange2 = () => {
        setChecked2(!checked2);
      };const handleChange3 = () => {
        setChecked3(!checked3);
      };const handleChange4 = () => {
        setChecked4(!checked4);
      };const handleChange5 = () => {
        setChecked5(!checked5);
      };const handleChange6 = () => {
        setChecked6(!checked6);
      };const handleChange7 = () => {
        setChecked7(!checked7);
      };const handleChange8 = () => {
        setChecked8(!checked8);
      };const handleChange9 = () => {
        setChecked9(!checked9);
      };const handleChange10 = () => {
        setChecked10(!checked10);
      };

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
                    <input type="checkbox" id="test1" checked={checked1} onChange={handleChange1} />
                    <label for="test1">house</label>
                </p>
                <p>Is "My 1" checked? {checked1.toString()}</p>
                <p>
                    <input type="checkbox" id="test2" checked={checked2} onChange={handleChange2} />
                    <label for="test2">techno</label>
                </p>
                <p>Is "My 2" checked? {checked2.toString()}</p>

                <p>
                    <input type="checkbox" id="test3" checked={checked3} onChange={handleChange3} />
                    <label for="test3">pop</label>
                </p>
                <p>
                    <input type="checkbox" id="test4" checked={checked4} onChange={handleChange4} />
                    <label for="test4">alternative rock</label>
                </p>
                <p>
                    <input type="checkbox" id="test5" checked={checked5} onChange={handleChange5} />
                    <label for="test5">rnb</label>
                </p>
                <p>
                    <input type="checkbox" id="test6"  checked={checked6} onChange={handleChange6}/>
                    <label for="test6">trap</label>
                </p>
                <p>
                    <input type="checkbox" id="test7" checked={checked7} onChange={handleChange7} />
                    <label for="test7">hiphop</label>
                </p>
                <p>
                    <input type="checkbox" id="test8" checked={checked8} onChange={handleChange8} />
                    <label for="test8">deep house</label>
                </p>
                <p>
                    <input type="checkbox" id="test9"  checked={checked9} onChange={handleChange9}/>
                    <label for="test9">melodic technomelodic techno</label>
                </p>
                <p>
                    <input type="checkbox" id="test10" checked={checked10} onChange={handleChange10} />
                    <label for="test10">progressive house</label>
                </p>
                <button >Submit</button>
            </form>

          


        </div>


    )
}
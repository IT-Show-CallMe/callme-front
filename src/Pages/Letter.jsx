import React, { useState } from "react";
import leftWingImage from '../assets/images/wing-left.png';
import rightWingImage from '../assets/images/wing-right.png';
// import styles from "../styles/main_letter.moudule.css";

function Letter() {

    return (
        <div className={styles.container}>
            <img src="images/back_short.png" alt="배경이미지" className="background-img" />

            <div className={styles.letterContainer}>
                <h1>call me</h1>

                <div className="letter-input-container">
                    <img src={leftWingImage} alt="Left Wing" className="wing left-wing" />

                    <div className="letter-input">
                        <button>×</button>
                        <div className="letter-background">
                            <img src="../images/letteremoji.png" alt="" />
                            <p className="to">to. fromName</p>
                            <textarea placeholder="후기를 작성해 주세요!" className="textarea"></textarea>
                            <p className="from">from. nickName</p>
                        </div>
                    </div>

                    <img src={rightWingImage} alt="Right Wing" className="wing right-wing" />
                </div>
            </div>
        </div>
    );

}

export default Letter;
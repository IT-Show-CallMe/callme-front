// 아이돌에게 남긴 편지 (편지 작성 화면)
import React, { useState } from "react";
// import styles from "../styles/main_letter.css";

function Letter() {

    return (
        <div className="letter-container">
            <img src="images/back_short.png" alt="배경이미지" className="background-img" />

            <div className="main-context">
                <h1>call me</h1>

                <div className="letter-input-container">
                    <img src="../images/wing-left.png" alt="날개 왼쪽" className="wing-left" />

                    <div className="letter-input">
                        <div className="letter-background">
                            <p className="to">to. fromName</p>
                            <textarea placeholder="후기를 작성해 주세요!" className="textarea"></textarea>
                            <p className="from">from. nickName</p>
                        </div>
                    </div>

                    <img src="images/wing-right.png" alt="날개 오른쪽" className="wing-right" />
                </div>
            </div>
        </div>
    );

}

export default Letter;
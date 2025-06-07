import React, { useEffect, useState } from "react";
import styles from "../styles/letter_confirm.module.css";
import LetterView from "../components/LetterView";

import { useNavigate } from "react-router-dom";

import leftWingImage from "../assets/images/wing-left.png";
import rightWingImage from "../assets/images/wing-right.png";
import emojiImage from "../assets/images/letteremoji.png";
import bgImage from "/images/back_short.png";

function LetterConfirm() {
    const [letter, setLetter] = useState(null);
    const [idolName, setIdolName] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem("sentLetter");
        const storedIdolName = localStorage.getItem("lastCalledIdolName");
        if (saved) {
            setLetter(JSON.parse(saved));
        }
        if (storedIdolName) {
            setIdolName(storedIdolName);
        }
    }, []);

    if (!letter) return <p>편지 정보를 불러오는 중...</p>;

    return (
        <div className={styles.container} style={{ minHeight: "auto" }}>
            <img src={bgImage} alt="배경" className={styles.backgroundImg} />
            <h1 className={styles.title}>call me</h1>
            {/* <h1 className={styles.title}>편지 확인</h1> */}
            <LetterView
                className={styles.letterContainer}
                to={idolName || `${letter.idolId}번 아이돌`}
                from={letter.nickname}
                content={letter.message}
                emojiImage={emojiImage}
                leftWingImage={leftWingImage}
                rightWingImage={rightWingImage}
            />
            <button className={styles.nextBtn} onClick={() => navigate("/main")}>
                main
            </button>
        </div>
    );
}

export default LetterConfirm;
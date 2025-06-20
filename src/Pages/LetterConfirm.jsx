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
    const [animationIndex, setAnimationIndex] = useState(null); // null -> 1~4
    const [isLetterVisible, setIsLetterVisible] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem("sentLetter");
        const storedIdolName = localStorage.getItem("lastCalledIdolName");
        if (saved) setLetter(JSON.parse(saved));
        if (storedIdolName) setIdolName(storedIdolName);
    }, []);

    useEffect(() => {
        if (!letter) return;

        const timeout = setTimeout(() => {
            setIsLetterVisible(false);
            setAnimationIndex(1);
        }, 1000); // 편지를 2초간 보여주고 애니메이션 시작

        return () => clearTimeout(timeout);
    }, [letter]);

    useEffect(() => {
        if (animationIndex === null || animationIndex >= 4) return;

        const interval = setInterval(() => {
            setAnimationIndex((prev) => prev + 1);
        }, 500);

        return () => clearInterval(interval);
    }, [animationIndex]);

    if (!letter) return <p>편지 정보를 불러오는 중...</p>;
    

    return (
        <div className={styles.container}>
            <img src={bgImage} alt="배경" className={styles.backgroundImg} />

            <h1 className={styles.title}>call me</h1>

            <div className={styles.letterWrapper}>
                {isLetterVisible && (
                    <LetterView
                        className={styles.letterContainer}
                        to={idolName || `${letter.idolId}번 아이돌`}
                        from={letter.nickname}
                        content={letter.message}
                        emojiImage={emojiImage}
                        leftWingImage={leftWingImage}
                        rightWingImage={rightWingImage}
                    />
                )}

                {animationIndex && (
                    <div className="letterAnimationContainer">
                        <img
                            src={`/images/letterAnimationImg/letter-${animationIndex}.png`}
                            alt={`letter frame ${animationIndex}`}
                            className={`${styles.letterAnimation} ${animationIndex === 4 ? styles.floating : ""}`}
                        />
                        <p style={{ color: "#BDBDBD", fontSize: "24px", marginTop: "60px", textAlign: "center" }}>
                            적은 편지는 메인 화면에서 볼 수 있습니다.
                        </p>
                    </div>
                )}
            </div>

            <button className={styles.nextBtn} onClick={() => navigate("/main")}>
                Next
            </button>
        </div>
    );
}

export default LetterConfirm;

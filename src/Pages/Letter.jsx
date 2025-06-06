import React, { useState, useEffect } from "react";
import styles from "../styles/main_letter.module.css";
import { useNavigate } from "react-router-dom";

import leftWingImage from "../assets/images/wing-left.png";
import rightWingImage from "../assets/images/wing-right.png";
import emojiImage from "../assets/images/letteremoji.png";
import bgImage from "/images/back_short.png";

function Letter() {
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [idolName, setIdolName] = useState("");
    const [nickName, setNickName] = useState("");
    const [idolId, setIdolId] = useState(null);

    const handleSend = async () => {
        try {
            const res = await fetch('/api/letter/message', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idolId, nickname: nickName, message }),
            });

            if (!res.ok) throw new Error("Failed to send letter");

            alert("성공적으로 전송되었습니다!");
            localStorage.setItem('sentLetter', JSON.stringify({
                idolId,
                nickname: nickName,
                message,
            }));
            navigate("/main");
        } catch (err) {
            console.error(err);
            alert("전송 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        const storedIdolId = localStorage.getItem("lastCalledIdolId");
        const storedIdolName = localStorage.getItem("lastCalledIdolName");
        if (storedIdolId) setIdolId(parseInt(storedIdolId));
        if (storedIdolName) setIdolName(storedIdolName);
    }, []);

    return (
        <div className={styles.container} style={{ minHeight: "auto" }}>
            <img src={bgImage} alt="배경" className={styles.backgroundImg} />
            <h1 className={styles.title}>call me</h1>

            <div className={styles.letterBox}>
                <img src={leftWingImage} alt="왼쪽 날개" className={styles.leftWing} />

                <div className={styles.letter}>
                    <button className={styles.closeBtn}>×</button>

                    <div className={styles.letterContainer}>
                        <div className={styles.headerContainer}>
                            <p className={styles.to}>to. {idolName}</p>
                            <img src={emojiImage} alt="이모지" className={styles.emoji} />
                        </div>

                        <hr className={styles.hrLine} />

                        <div
                            contentEditable={true}
                            className={styles.textarea}
                            onInput={(e) => setMessage(e.currentTarget.textContent)}
                            suppressContentEditableWarning={true}
                            data-placeholder="후기를 작성해 주세요!"
                        />

                        <div className={styles.nickNameInputContainer}>
                            <p>from. </p>
                            <input
                                type="text"
                                className={styles.nicknameInput}
                                value={nickName}
                                onChange={(e) => setNickName(e.target.value)}
                                placeholder="닉네임"
                            />
                        </div>
                    </div>
                </div>

                <img src={rightWingImage} alt="오른쪽 날개" className={styles.rightWing} />
            </div>

            <button className={styles.sendBtn} onClick={handleSend}>
                send
            </button>
        </div>
    );
}

export default Letter;

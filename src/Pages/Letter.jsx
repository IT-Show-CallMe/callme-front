import React, { useState } from "react";
import styles from "../styles/main_letter.module.css";

import leftWingImage from "../assets/images/wing-left.png";
import rightWingImage from "../assets/images/wing-right.png";
import emojiImage from "/images/letteremoji.png";
import bgImage from "/images/back_short.png";

function Letter({ idolName, nickName }) {
    const [message, setMessage] = useState("");

    const handleSend = async () => {
        try {
            const res = await fetch("https://your-backend-api.com/letters", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: idolName,
                    from: nickName,
                    message,
                }),
            });

            if (!res.ok) throw new Error("Failed to send letter");
            alert("성공적으로 전송되었습니다!");
        } catch (err) {
            console.error(err);
            alert("전송 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className={styles.container}>
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

                        {/* <hr className={styles.hrLine} /> */}

                        <p className={styles.from}>from. {nickName}</p>
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
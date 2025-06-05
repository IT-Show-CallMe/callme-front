import React, { useRef, useEffect } from 'react';
import styles from "../styles/main_letter.module.css";

export default function LetterView({ to, from, content, emojiImage, leftWingImage, rightWingImage, className }) {
    const textareaRef = useRef(null);
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        const hasScroll = el.scrollHeight > el.clientHeight;
        el.style.paddingRight = hasScroll ? "10px" : "0px";
    }, [content]);
    return (
        <div className={styles.letterBox}>
            <img src={leftWingImage} alt="왼쪽 날개" className={styles.leftWing} />
            <div className={`${styles.letter} ${className || ""}`}>
                <div className={styles.letterContainer}>
                    <div className={styles.headerContainer}>
                        <p className={styles.to}>to. {to}</p>
                        <img src={emojiImage} alt="이모지" className={styles.emoji} />
                    </div>
                    <hr className={styles.hrLine} />
                    <div className={styles.textarea} style={{ whiteSpace: 'pre-line', overflowY: 'auto', }}>
                        {content}
                    </div>
                    <div className={styles.nickNameInputContainer}>
                        <p>from. {from}</p>
                    </div>
                </div>
            </div>
            <img src={rightWingImage} alt="오른쪽 날개" className={styles.rightWing} />

        </div>
    );
}

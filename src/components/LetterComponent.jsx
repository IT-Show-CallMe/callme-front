import React, { useState } from 'react';
import closedImg from '../assets/images/letter_closed.png';
import slightlyOpenImg from '../assets/images/letter_slightly_open.png';
import moreOpenImg from '../assets/images/letter_more_open.png';
import fullyOpenImg from '../assets/images/letter_fully_open.png';
import styles from './letterComponent.module.css'

const letterImages = [closedImg, slightlyOpenImg, moreOpenImg, fullyOpenImg];

export default function LetterComponent() {
    const [openStep, setOpenStep] = useState(0);

    // 클릭하면 다음 단계로 넘어감 (마지막 단계에서는 멈춤)
    const handleClick = () => {
        setOpenStep((prev) => (prev < 3 ? prev + 1 : prev));
    };

    return (
        <img
            src={letterImages[openStep]}
            alt="편지지"
            onClick={handleClick}
            style={{
                cursor: 'pointer',
                transition: 'all 0.3s',
                width: "400px",       // 원하는 크기로 조절
                height: "auto",
            }}
        />
    );
}
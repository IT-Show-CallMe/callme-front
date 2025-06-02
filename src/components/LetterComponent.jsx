import React, { useState } from 'react';
import closedImg from '../assets/images/letter_closed.png';
import slightlyOpenImg from '../assets/images/letter_slightly_open.png';
import moreOpenImg from '../assets/images/letter_more_open.png';
import fullyOpenImg from '../assets/images/letter_fully_open.png';
import styles from './letterComponent.module.css'

const letterImages = [closedImg, slightlyOpenImg, moreOpenImg, fullyOpenImg];

export default function LetterComponent() {
    const [openStep, setOpenStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // 클릭하면 자동으로 펼쳐짐
    const handleClick = () => {
        if (isAnimating || openStep === 3) return; // 이미 애니메이션 중 or 다 열리면 무시
        setIsAnimating(true);

        let currStep = openStep;
        const interval = setInterval(() => {
            currStep += 1;
            setOpenStep(currStep);
            if (currStep === 3) {
                clearInterval(interval);
                setIsAnimating(false);
            }
        }, 300);
    }

    return (
        <img
            src={letterImages[openStep]}
            alt="편지지"
            onClick={handleClick}
            style={{
                cursor: openStep === 3 ? 'default' : 'pointer',
                transition: 'all 0.5s',
                width: "400px",
                height: "auto",
                userSelect: 'none',
            }}
        />
    );
}
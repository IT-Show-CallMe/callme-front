import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import LetterView from './LetterView'
import closedImg from '../assets/images/letter_closed.png';
import slightlyOpenImg from '../assets/images/letter_slightly_open.png';
import moreOpenImg from '../assets/images/letter_more_open.png';
import fullyOpenImg from '../assets/images/letter_fully_open.png';
import leftWingImage from "../assets/images/wing-left.png";
import rightWingImage from "../assets/images/wing-right.png";
import emojiImage from "../assets/images/letteremoji.png";
// import bgImage from "/images/back_short.png";

import styles from './letterComponent.module.css'

const letterImages = [closedImg, slightlyOpenImg, moreOpenImg, fullyOpenImg];

// id, to, from, content, 
export default function LetterComponent({ to, from, content, isActive, onOpen, onClose, centerPos, className }) {
    console.log('LetterComponent content:', content);
    const [openStep, setOpenStep] = useState(0);
    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
    const letterRef = useRef(null);

    // 편지의 초기 위치 저장
    useEffect(() => {
        if (letterRef.current && !isActive) {
            const rect = letterRef.current.getBoundingClientRect();
            setInitialPosition({
                x: rect.left + rect.width / 2, // 중심점
                y: rect.top + rect.height / 2
            });
        }
    }, [isActive]);

    useEffect(() => {
        let interval;
        if (isActive) {
            setOpenStep(1);
            let currStep = 1;
            interval = setInterval(() => {
                currStep += 1;
                setOpenStep(currStep);
                if (currStep === 3) clearInterval(interval);
            }, 400);
            return () => clearInterval(interval);
        } else {
            setOpenStep(0);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const handleClick = () => {
        if (!isActive) {
            onOpen();
            return;
        }
        if (isActive && openStep === 3) {
            onClose();
            setOpenStep(0);
        }
    }

    // 애니메이션 단계별 위치와 크기 계산
    const getAnimationStyle = (step) => {
        if (step === 0) return {};

        // 화면 중앙 좌표
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // 단계별 진행률 (0~1)
        const progress = step / 3;

        // 위치 보간 (초기 위치 → 중앙)
        const currentX = initialPosition.x + (centerX - initialPosition.x) * progress;
        const currentY = initialPosition.y + (centerY - initialPosition.y) * progress;

        // 크기 변화 (0.8 → 1.2)
        const scale = 0.8 + (0.4 * progress);

        return {
            position: 'fixed',
            left: `${currentX}px`,
            top: `${currentY}px`,
            transform: `translate(-50%, -50%) scale(${scale})`,
            zIndex: 1000,
            transition: step === 1 ? 'none' : 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        };
    };
    const closedLetter = (
        <div onClick={handleClick}>
            <img
                src={letterImages[0]}
                alt="편지지"
                style={{
                    cursor: 'pointer',
                    width: "400px",
                    height: "auto",
                    userSelect: 'none',
                    opacity: isActive ? 0.3 : 1, // 활성화되면 살짝 투명하게
                    transition: 'opacity 0.3s ease'
                }}
            />
        </div>
    );

    const openLetter = isActive ? createPortal(
        <>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 998,
                    opacity: openStep >= 2 ? (openStep - 1) * 0.5 : 0,
                    transition: 'opacity 0.4s ease'
                }}
                onClick={onClose}
            />

            {/* 편지 내용 */}
            <div style={getAnimationStyle(openStep)}>
                {openStep < 3 && (
                    <img
                        src={letterImages[openStep]}
                        alt="편지지"
                        style={{
                            cursor: 'pointer',
                            transition: 'all 0.5s ease-in-out',
                            width: "400px",
                            height: "auto",
                            userSelect: 'none',
                            transform: `scale(${0.6 + (openStep * 0.15)})`,
                        }}
                    />
                )}
                {openStep === 3 && (
                    <div
                        onClick={handleClick}
                        style={{
                            cursor: 'pointer',
                            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
                        }}
                    >
                        <LetterView
                            to={to}
                            from={from}
                            content={content}
                            emojiImage={emojiImage}
                            leftWingImage={leftWingImage}
                            rightWingImage={rightWingImage}
                            styles={styles}
                            className={className}
                        />
                    </div>
                )}
            </div>
        </>,
        document.body
    ) : null;
    // 중앙 이동용 스타일
    // const centerStyle = isActive
    //     ? {
    //         position: "absolute",
    //         // left: `${centerPos.x}px`,
    //         // top: `${centerPos.y}px`,
    //         left: "50%",
    //         top: "50%",
    //         zIndex: 1000,
    //         width: "400px",
    //         transform: "translate(-50%, -50%) scale(1.2)",
    //         transition: "all 0.7s cubic-bezier(.7,1.5,.7,1)",
    //     }
    //     : { };

    // 애니메이션용 transform
    // const getTransform = () => {
    //     if (openStep === 0) return "none";
    //     const scales = [0.6, 0.8, 0.95, 1];
    //     const translates = [
    //         "translate(-40vw, -30vh)",
    //         "translate(-20vw, -15vh)",
    //         "translate(-8vw, -6vh)",
    //         "translate(0, 0)",
    //     ];
    //     return `scale(${scales[openStep]}) ${translates[openStep]}`;
    // }
    // console.log('2LetterComponent content:', content);

    return (
        <>
            {closedLetter}
            {openLetter}
        </>
    );
}
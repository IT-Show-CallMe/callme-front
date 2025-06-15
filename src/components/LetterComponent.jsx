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

import styles from './letterComponent.module.css'

const letterImages = [closedImg, slightlyOpenImg, moreOpenImg, fullyOpenImg];

export default function LetterComponent({
    letterId,
    to,
    from,
    content,
    isActive,
    onOpen,
    onClose,
    centerPos,
    className,
    isLoading = false
}) {
    console.log('LetterComponent - letterId:', letterId, 'content:', content, 'isLoading:', isLoading);
    const [openStep, setOpenStep] = useState(0);
    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
    const [animationProgress, setAnimationProgress] = useState(0);
    const letterRef = useRef(null);

    // 편지의 초기 위치 저장
    useEffect(() => {
        if (letterRef.current && !isActive) {
            const rect = letterRef.current.getBoundingClientRect();
            setInitialPosition({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            });
        }
    }, [isActive]);

    // 부드러운 애니메이션을 위한 useEffect
    useEffect(() => {
        let animationFrame;
        let startTime;

        if (isActive && !isLoading) {
            const animateOpen = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;

                // 전체 애니메이션 시간: 2초 (2000ms)
                const totalDuration = 2000;
                const progress = Math.min(elapsed / totalDuration, 1);

                // 부드러운 easing 함수 적용
                const easedProgress = easeOutCubic(progress);
                setAnimationProgress(easedProgress);

                // 단계별 openStep 설정 (더 자연스럽게)
                if (easedProgress < 0.2) {
                    setOpenStep(0);
                } else if (easedProgress < 0.4) {
                    setOpenStep(1);
                } else if (easedProgress < 0.7) {
                    setOpenStep(2);
                } else if (easedProgress < 0.9) {
                    setOpenStep(3);
                } else {
                    setOpenStep(4); // 완전히 열림
                }

                if (progress < 1) {
                    animationFrame = requestAnimationFrame(animateOpen);
                }
            };

            animationFrame = requestAnimationFrame(animateOpen);

            return () => {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
            };
        } else {
            setOpenStep(0);
            setAnimationProgress(0);
        }
    }, [isActive, isLoading]);

    // easing 함수들
    const easeOutCubic = (t) => {
        return 1 - Math.pow(1 - t, 3);
    };

    const easeInOutQuad = (t) => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const handleClick = () => {
        if (!isActive) {
            onOpen();
            return;
        }
        if (isActive && openStep >= 3) {
            onClose();
            setOpenStep(0);
            setAnimationProgress(0);
        }
    }

    // 애니메이션 단계별 위치와 크기 계산 (더 부드럽게)
    const getAnimationStyle = () => {
        if (animationProgress === 0) return {};

        // 화면 중앙 좌표
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // 부드러운 위치 보간
        const positionProgress = easeInOutQuad(animationProgress);
        const currentX = initialPosition.x + (centerX - initialPosition.x) * positionProgress;
        const currentY = initialPosition.y + (centerY - initialPosition.y) * positionProgress;

        // 부드러운 크기 변화
        const scaleProgress = easeOutCubic(animationProgress);
        const scale = 0.8 + (0.5 * scaleProgress); // 0.8 → 1.3

        // 회전 효과 추가 (선택사항)
        const rotation = Math.sin(animationProgress * Math.PI) * 2; // 미세한 회전

        return {
            position: 'fixed',
            left: `${currentX}px`,
            top: `${currentY}px`,
            transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
            zIndex: 1000,
            transition: 'none', // requestAnimationFrame으로 애니메이션하므로 transition 제거
            filter: `drop-shadow(0 ${10 + (20 * scaleProgress)}px ${20 + (40 * scaleProgress)}px rgba(0,0,0,${0.1 + (0.2 * scaleProgress)}))`
        };
    };

    // 편지 이미지 선택 로직 개선
    const getCurrentLetterImage = () => {
        if (openStep === 0) return letterImages[0];
        if (openStep === 1) return letterImages[1];
        if (openStep === 2) return letterImages[2];
        if (openStep === 3) return letterImages[3];
        return letterImages[3]; // 완전히 열린 상태
    };

    // 편지 이미지 투명도 계산
    const getLetterOpacity = () => {
        if (isLoading) return 0.7;
        if (openStep < 4) return 1;
        // 완전히 열린 후 편지 내용이 나타날 때 페이드아웃
        return Math.max(0, 1 - (animationProgress - 0.9) * 10);
    };

    const closedLetter = (
        <div onClick={handleClick} ref={letterRef}>
            <img
                src={letterImages[0]}
                alt="편지지"
                style={{
                    cursor: 'pointer',
                    width: "360px",
                    height: "180px",
                    padding: "10px",
                    userSelect: 'none',
                    opacity: isActive ? 0.2 : 1,
                    transition: 'opacity 0.3s ease',
                    filter: isActive ? 'blur(1px)' : 'none'
                }}
            />
        </div>
    );

    const openLetter = isActive ? createPortal(
        <>
            {/* 배경 오버레이 */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 998,
                    opacity: Math.min(animationProgress * 2, 0.5),
                    transition: 'none'
                }}
                onClick={onClose}
            />

            {/* 편지 애니메이션 */}
            <div style={getAnimationStyle()}>
                {openStep < 4 && (
                    <div style={{ position: 'relative' }}>
                        <img
                            src={getCurrentLetterImage()}
                            alt="편지지"
                            style={{
                                cursor: 'pointer',
                                width: "400px",
                                height: "auto",
                                userSelect: 'none',
                                opacity: getLetterOpacity(),
                                transition: 'opacity 0.3s ease'
                            }}
                        />
                        {isLoading && (
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: '#333',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                pointerEvents: 'none',
                                opacity: Math.sin(Date.now() * 0.005) * 0.3 + 0.7 // 깜빡이는 효과
                            }}>
                                편지 내용을<br />불러오는 중...
                            </div>
                        )}
                    </div>
                )}

                {/* 편지 내용 (완전히 열린 후 페이드인) */}
                {openStep >= 4 && !isLoading && (
                    <div
                        onClick={handleClick}
                        style={{
                            cursor: 'pointer',
                            opacity: Math.min((animationProgress - 0.9) * 10, 1),
                            transform: `translateY(${Math.max(0, (1 - (animationProgress - 0.9) * 10)) * 20}px)`,
                            transition: 'none'
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

    return (
        <>
            {closedLetter}
            {openLetter}
        </>
    );
}
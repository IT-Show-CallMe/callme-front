import React, { useEffect, useState, useRef } from 'react';
import mainPageStyles from '../styles/MainPage.module.css';

function CaptureTimeSection() {
    const [photos, setPhotos] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        // 사진 배열 (최신순으로 이미 정렬됨: 최신이 앞쪽)
        const dummyPhotos = [
            {
                id: 5,
                url: '/images/captureTimeViewImgEx.png',
                idol: '아이유',
                timestamp: '2025-06-12T09:30:00Z',
                consent: true
            },
            {
                id: 4,
                url: '/images/captureTimeViewImgEx.png',
                idol: '카리나',
                timestamp: '2025-06-11T14:00:00Z',
                consent: true
            },
            {
                id: 3,
                url: '/images/captureTimeViewImgEx.png',
                idol: '장원영',
                timestamp: '2025-06-13T10:00:00Z',
                consent: true
            },
            {
                id: 2,
                url: '/images/captureTimeViewImgEx.png',
                idol: '아이유',
                timestamp: '2025-06-12T09:30:00Z',
                consent: true
            },
            {
                id: 1,
                url: '/images/captureTimeViewImgEx.png',
                idol: '카리나',
                timestamp: '2025-06-11T14:00:00Z',
                consent: true
            },

        ];

        const filtered = dummyPhotos.filter(photo => photo.consent);
        setPhotos(filtered);
    }, []);

    const scroll = (direction) => {
        if (!scrollRef.current) return;
        const scrollAmount = 320; // 한 번에 이동할 px (이미지 너비 + 간격)
        if (direction === 'left') {
            scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (

        <div style={{ position: 'relative', width: '100%', display: 'flex', margin: '0 auto', justifyContent: 'center' }}>
            {/* 이미지 가로 스크롤 컨테이너 (버튼 포함 영역) */}
            <div style={{ position: 'relative', display: 'flex', width: '1500px', alignItems: 'center', justifyContent: 'center' }}>
                {/* 좌측 버튼 */}
                <button
                    onClick={() => scroll('left')}
                    style={{
                        zIndex: 10,
                        background: 'rgba(0,0,0,0.5)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        color: 'white',
                        cursor: 'pointer',
                        marginRight: '8px',
                        flexShrink: 0,
                    }}
                    aria-label="왼쪽으로 스크롤"
                >
                    &#8249;
                </button>

                {/* 가로 스크롤 영역 */}
                <div
                    ref={scrollRef}
                    className={mainPageStyles.captureTimeImgWrapper}
                    style={{
                        display: 'flex',
                        overflowX: 'hidden',
                        // gap: '12px',
                        padding: '16px 0',
                        scrollSnapType: 'x mandatory',
                        flexGrow: 1,  // 버튼 제외 나머지 영역 다 차지
                    }}
                >
                    {photos.map((photo) => (
                        <img
                            key={photo.id}
                            src={photo.url}
                            alt={`${photo.idol}과의 사진`}
                            className={mainPageStyles.captureImage}
                            style={{
                                width: '600px',
                                objectFit: 'cover',
                                scrollSnapAlign: 'start',
                                flexShrink: 0,
                                borderRadius: '8px',
                                marginRight: '-70px'
                            }}
                        />
                    ))}
                </div>

                {/* 우측 버튼 */}
                <button
                    onClick={() => scroll('right')}
                    style={{
                        zIndex: 10,
                        background: 'rgba(0,0,0,0.5)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        color: 'white',
                        cursor: 'pointer',
                        marginLeft: '8px',
                        flexShrink: 0,
                    }}
                    aria-label="오른쪽으로 스크롤"
                >
                    &#8250;
                </button>
            </div>
        </div>

    );
}

export default CaptureTimeSection;

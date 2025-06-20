import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import mainPageStyles from '../styles/mainPage.module.css';

function CaptureTimeSection() {
    const [photos, setPhotos] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        axios.get('https://callme.mirim-it-show.site/email/capPhoto')
            .then(response => {
                setPhotos(response.data);
            })
            .catch(error => {
                console.error('사진 가져오기 실패', error);
            });
    }, []);

    // const filtered = dummyPhotos.filter(photo => photo.consent);
    // setPhotos(filtered);

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
                            key={photo.id || idx}
                            src={`https://callme.mirim-it-show.site/${photo.capPhoto}`}
                            alt={`사진 촬영이 정상적으로 종료되지 않아서 이미지가 보이지 않아요ㅠㅠ촬영을 끝까지 마무리해 주세요!! ${photo.id}`}
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

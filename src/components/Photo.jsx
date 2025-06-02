import React, { useState, useEffect, useRef } from 'react';
import '../styles/IdolPhoto.css';

function Photo({ name }) {
  const [imgSrc, setImgSrc] = useState(`/images/idolPhotos/${name}.png`);
  const videoRef = useRef(null);

  useEffect(() => {
    // 웹캠 접근
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('카메라 접근 실패:', err);
      });

    // 언마운트 시 카메라 정리
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="photo-background">
      <div className="photo-frame-container">
        {/* 1. 내 웹캠 영상 */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="video-feed"
        />

        {/* 2. 아이돌 이미지 (프레임 위에 뜨도록) */}
        <img
          src={imgSrc}
          alt={`${name}와 함께 사진`}
          className="idol-photo-image"
          onError={() => {
            console.warn(`이미지를 불러올 수 없습니다: ${imgSrc}`);
            setImgSrc('/images/idolPhotos/default.png');
          }}
        />

        {/* 3. 프레임 이미지 (맨 위에 고정) */}
        <img
          src="/images/photo-frame.png"
          alt="프레임"
          className="frame-image"
        />
      </div>
    </div>
  );
}

export default Photo;

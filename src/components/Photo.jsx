import React, { useState, useEffect, useRef } from 'react';
import '../styles/IdolPhoto.css';

function Photo({ name }) {
  const [imgSrc, setImgSrc] = useState(`/images/idolPhotos/${name}.png`);
  const [count, setCount] = useState(3); // 카운트다운 초기값 3
  const videoRef = useRef(null);
  const idolImageRef = useRef(null);
  const frameImageRef = useRef(null);
  const containerRef = useRef(null);

  // 웹캠 실행
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('카메라 접근 실패:', err);
      });

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // 카운트다운 효과
  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else if (count === 0) {
      // 카운트 끝나면 자동 촬영
      handleCapture();
      setCount(null); // 카운트 숨기기
    }
  }, [count]);

  // 사진 찍기 함수
  const handleCapture = () => {
    const video = videoRef.current;
    const idolImg = idolImageRef.current;
    const frameImg = frameImageRef.current;
    const container = containerRef.current;

    if (!video || !idolImg || !frameImg || !container) {
      console.warn('요소들이 준비되지 않았습니다.');
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const offsetX = containerRect.left;
    const offsetY = containerRect.top;

    // 비디오 위치 및 크기 계산
    const videoRect = video.getBoundingClientRect();
    const videoAspect = video.videoWidth / video.videoHeight;
    const videoBoxAspect = videoRect.width / videoRect.height;
    let drawVideoWidth, drawVideoHeight;

    if (videoAspect > videoBoxAspect) {
      drawVideoWidth = videoRect.width;
      drawVideoHeight = drawVideoWidth / videoAspect;
    } else {
      drawVideoHeight = videoRect.height;
      drawVideoWidth = drawVideoHeight * videoAspect;
    }

    const videoDrawX = videoRect.left - offsetX + (videoRect.width - drawVideoWidth) / 2;
    const videoDrawY = videoRect.top - offsetY + (videoRect.height - drawVideoHeight) / 2;

    ctx.drawImage(video, videoDrawX, videoDrawY, drawVideoWidth, drawVideoHeight);

    // 아이돌 이미지 그리기
    const idolRect = idolImg.getBoundingClientRect();
    ctx.drawImage(idolImg,
      idolRect.left - offsetX,
      idolRect.top - offsetY,
      idolRect.width,
      idolRect.height
    );

    // 프레임 이미지 그리기
    const frameRect = frameImg.getBoundingClientRect();
    ctx.drawImage(frameImg,
      frameRect.left - offsetX,
      frameRect.top - offsetY,
      frameRect.width,
      frameRect.height
    );

    // 저장 자동 실행
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `photo_with_${name}.png`;
    link.click();
  };
  return (
    <div className="photo-background" ref={containerRef}>
      <div className="photo-frame-container">
        {/* 웹캠 영상 */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="video-feed"
        />

        {/* 아이돌 이미지 */}
        <img
          ref={idolImageRef}
          src={imgSrc}
          alt={`${name}와 함께 사진`}
          className="idol-photo-image"
          onError={() => {
            console.warn(`이미지를 불러올 수 없습니다: ${imgSrc}`);
            setImgSrc('/images/idolPhotos/default.png');
          }}
        />

        {/* 프레임 이미지 */}
        <img
          ref={frameImageRef}
          src="/images/photo-frame.png"
          alt="프레임"
          className="frame-image"
        />

        {/* 카운트다운 텍스트 */}
        {count !== null && (
          <div className="countdown">{count}</div>
        )}
      </div>
    </div>
  );
}

export default Photo;

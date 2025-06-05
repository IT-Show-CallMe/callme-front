import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동용
import '../styles/IdolPhoto.css';

function Photo({ name }) {
  const [imgSrc, setImgSrc] = useState(`/images/idolPhotos/${name}_with_frame.png`);
  const [count, setCount] = useState(10);
  const [showFlash, setShowFlash] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null); // 캡쳐된 이미지 저장
  const videoRef = useRef(null);
  const idolImageRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

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

  // 카운트다운
  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else if (count === 0) {
      handleCapture();
      setCount(null);
    }
  }, [count]);

  // 사진 찍기
  const handleCapture = () => {
    const video = videoRef.current;
    const idolImg = idolImageRef.current;
    const container = containerRef.current;

    if (!video || !idolImg || !container) {
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

    // 비디오 위치 계산
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

    // 비디오 프레임 (좌우반전)
    ctx.save();
    ctx.translate(videoDrawX + drawVideoWidth, videoDrawY);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, drawVideoWidth, drawVideoHeight);
    ctx.restore();

    // 아이돌+프레임 이미지
    const idolRect = idolImg.getBoundingClientRect();
    ctx.drawImage(
      idolImg,
      idolRect.left - offsetX,
      idolRect.top - offsetY,
      idolRect.width,
      idolRect.height
    );

    // 캡쳐된 이미지 데이터 저장
    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);

    // 이미지 저장(다운로드)
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `photo_with_${name}.png`;
    link.click();

    // 찰칵! 사운드 재생
    const shutterSound = new Audio('/images/sound/찰칵!.mp3');
    shutterSound.play().catch(err => console.warn('사운드 재생 실패:', err));

    // 플래시 켜기
    setShowFlash(true);

    // 0.5초 후 플래시 끄고, 캡처 화면 2초 유지 후 페이지 이동
    setTimeout(() => {
      setShowFlash(false);

      setTimeout(() => {
        navigate('/email');
      }, 2000);

    }, 500);
  };

  return (
    <div className="photo-background" ref={containerRef}>
      <div className="photo-frame-container">
        {!capturedImage && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="video-feed mirror-video"
          />
        )}

        {/* 캡쳐된 이미지가 있으면 비디오 대신 보여줌 */}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            className="captured-photo"
          />
        )}

        {/* 아이돌+프레임 이미지는 캡쳐 후 비디오가 사라졌으므로 안 보이게 처리 */}
        {!capturedImage && (
          <img
            ref={idolImageRef}
            src={imgSrc}
            alt={`${name}와 함께 사진`}
            className={`idol-photo-image idol-position-${name}`}
            onError={() => {
              console.warn(`이미지를 불러올 수 없습니다: ${imgSrc}`);
              setImgSrc('/images/idolPhotos/default_with_frame.png');
            }}
          />
        )}

        {/* 카운트다운 */}
        {count !== null && (
          <div className="countdown">{count}</div>
        )}

        {/* 플래시 효과 */}
        {showFlash && <div className="flash"></div>}
      </div>
    </div>
  );
}

export default Photo;

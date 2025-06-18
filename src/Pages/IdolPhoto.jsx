import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import '../styles/IdolPhoto.css';

function IdolPhoto() {
  const { name } = useParams();
  const [imgSrc, setImgSrc] = useState('');
  const [count, setCount] = useState(5);
  const [showFlash, setShowFlash] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const videoRef = useRef(null);
  const idolImageRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const frame = location.state?.frame || 'default';

  useEffect(() => {
    const suffix = frame === 'cute' ? '-cute-frame.png' : '_with_frame.png';
    const path = `/images/idolPhotos/${name}${suffix}`;
    console.log('설정된 이미지 경로:', path);
    setImgSrc(path);
  }, [name, frame]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('카메라 접근 실패:', err);
      });

    // 스트림 정지 코드 제거 (화면 멈춤 방지)
    return () => {
      // 빈 함수로 둡니다.
    };
  }, []);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else if (count === 0) {
      handleCapture();
      setCount(null);
    }
  }, [count]);

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const roundRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const handleCapture = async () => {
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
    ctx.clearRect(0, 0, width, height);

    const offsetX = containerRect.left;
    const offsetY = containerRect.top;

    const videoRect = video.getBoundingClientRect();
    const videoAspect = video.videoWidth / video.videoHeight;
    const videoBoxAspect = videoRect.width / videoRect.height;

    const frameOffsets = {
      default: { offsetRight: 0, offsetTop: 0 },
      cute: { offsetRight: -10, offsetTop: -20 },
    };
    const { offsetRight, offsetTop } = frame === 'cute' ? frameOffsets.cute : frameOffsets.default;

    let drawVideoWidth, drawVideoHeight;

    if (videoAspect > videoBoxAspect) {
      drawVideoWidth = videoRect.width + 17;
      drawVideoHeight = drawVideoWidth / videoAspect;
    } else {
      drawVideoHeight = videoRect.height;
      drawVideoWidth = drawVideoHeight * videoAspect + 17;
    }

    let videoDrawX = videoRect.left - offsetX + (videoRect.width - drawVideoWidth) / 2 + offsetRight;
    const videoDrawY = videoRect.top - offsetY + (videoRect.height - drawVideoHeight) / 2 + offsetTop;
    videoDrawX += 15; // 왼쪽 보정

    // 비디오 미러링 및 둥근 사각형 클리핑
    ctx.save();
    ctx.translate(videoDrawX + drawVideoWidth, videoDrawY);
    ctx.scale(-1, 1);

    ctx.beginPath();
    roundRect(ctx, 0, 0, drawVideoWidth, drawVideoHeight, Math.min(drawVideoWidth, drawVideoHeight) / 5);
    ctx.clip();

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, drawVideoWidth, drawVideoHeight);
    ctx.restore();

    // 아이돌 프레임 덮기
    const idolRect = idolImg.getBoundingClientRect();
    ctx.drawImage(
      idolImg,
      idolRect.left - offsetX,
      idolRect.top - offsetY,
      idolRect.width,
      idolRect.height
    );

    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);

    const sendImageToServer = async (dataUrl) => {
      const blob = dataURLtoBlob(dataUrl);
      const formData = new FormData();
      formData.append('captureImg', blob, 'capture.png');

      try {
        const response = await fetch('http://15.165.15.236:3000/email/send', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error(`서버 응답 에러: ${response.statusText}`);
        const text = await response.text();
        console.log('서버 응답:', text);
      } catch (error) {
        console.error('이미지 전송 실패:', error);
      }
    };

    await sendImageToServer(dataUrl);

    const shutterSound = new Audio('/images/sound/찰칵!.mp3');
    shutterSound.play().catch((err) => console.warn('사운드 재생 실패:', err));

    setShowFlash(true);
    setTimeout(() => {
      setShowFlash(false);
      setTimeout(() => {
        navigate('/letter', { state: { capturedImage: dataUrl } });
      }, 500);
    }, 500);
  };

  return (
    <div
      className="photo-background"
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#000',
      }}
    >
      <div
        className="photo-frame-container"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {!capturedImage && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="video-feed mirror-video"
            style={{ objectFit: 'cover' }}
          />
        )}

        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            className="captured-photo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}

        {!capturedImage && (
          <img
            ref={idolImageRef}
            src={imgSrc}
            alt={`${name}와 함께 사진`}
            className={`idol-photo-image idol-position-${name} ${
              frame === 'cute' ? 'idol-frame-cute' : 'idol-frame-default'
            }`}
            onError={() => {
              console.warn(`이미지를 불러올 수 없습니다: ${imgSrc}`);
              setImgSrc('/images/idolPhotos/default_with_frame.png');
            }}
          />
        )}

        {count !== null && (
          <div
            className="countdown"
            style={{
              position: 'absolute',
              fontSize: '5rem',
              color: 'white',
              fontWeight: 'bold',
              textShadow: '0 0 10px black',
              userSelect: 'none',
            }}
          >
            {count}
          </div>
        )}

        {showFlash && (
          <div
            className="flash"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
              opacity: 0.8,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
}

export default IdolPhoto;

import React, { useState, useEffect, useRef  } from 'react';
import { useLocation } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/IdolPhoto.css';

function IdolPhoto() {
  const { name } = useParams();
  const [imgSrc, setImgSrc] = useState('');
  const [count, setCount] = useState(10); // 10초 카운트다운 시작
  const [showFlash, setShowFlash] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const videoRef = useRef(null);
  const idolImageRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const location = useLocation();
const frame = location.state?.frame || "default"; // 기본값 "default"

  useEffect(() => {
  const suffix = frame === "cute" ? "-cute-frame.png" : "_with_frame.png";
  const path = `/images/idolPhotos/${name}${suffix}`;
  console.log('설정된 이미지 경로:', path);
  setImgSrc(path);
}, [name, frame]);
  // 카메라 접근 및 정리
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

  // dataURL -> Blob 변환 함수
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

  // 사진 캡처 및 서버 전송
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

    const offsetX = containerRect.left;
    const offsetY = containerRect.top;

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

    // 좌우 반전해서 그리기
    ctx.save();
    ctx.translate(videoDrawX + drawVideoWidth, videoDrawY);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, drawVideoWidth, drawVideoHeight);
    ctx.restore();

    // 아이돌 이미지 덮어쓰기
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

    // 서버로 사진 전송 함수
    const sendImageToServer = async (dataUrl) => {
      const blob = dataURLtoBlob(dataUrl);
      const formData = new FormData();
      formData.append('captureImg', blob, 'capture.png');

      try {
        const response = await fetch('http://localhost:3000/email/send', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`서버 응답 에러: ${response.statusText}`);
        }
        const text = await response.text();
        console.log('서버 응답:', text);
      } catch (error) {
        console.error('이미지 전송 실패:', error);
      }
    };

    // 사진 서버 전송 실행
    await sendImageToServer(dataUrl);

    // 찰칵 사운드 재생, 플래시 효과 유지
    const shutterSound = new Audio('/images/sound/찰칵!.mp3');
    shutterSound.play().catch(err => console.warn('사운드 재생 실패:', err));

    setShowFlash(true);

    setTimeout(() => {
      setShowFlash(false);
      setTimeout(() => {
        // capturedImage 넘기면서 /letter 페이지로 이동
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
  className={`idol-photo-image idol-position-${name} ${frame === "cute" ? "idol-frame-cute" : "idol-frame-default"}`}
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

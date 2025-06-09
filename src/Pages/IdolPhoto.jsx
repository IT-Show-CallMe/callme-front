import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/IdolPhoto.css';

function IdolPhoto() {
  const { name } = useParams();
  const [imgSrc, setImgSrc] = useState('');
  const [count, setCount] = useState(10);
  const [showFlash, setShowFlash] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const videoRef = useRef(null);
  const idolImageRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // name이 바뀔 때마다 imgSrc 업데이트
  useEffect(() => {
    const path = `/images/idolPhotos/${name}_with_frame.png`;
    console.log('현재 name:', name);
    console.log('설정된 이미지 경로:', path);
    setImgSrc(path);
  }, [name]);

  useEffect(() => {
    // 카메라 접근
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

    const email = prompt('이메일 주소를 입력하세요');

    if (email) {
      try {
        const imageBlob = dataURLtoBlob(dataUrl);
        const formData = new FormData();
        formData.append('email', email);
        formData.append('image', imageBlob, `photo_with_${name}.png`);

        const response = await fetch('/api/send-photo-email', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          alert('이메일이 전송되었습니다.');
        } else {
          const errData = await response.json();
          alert('이메일 전송 실패: ' + (errData.message || '알 수 없는 오류'));
        }
      } catch (error) {
        alert('서버 요청 중 오류가 발생했습니다.');
        console.error(error);
      }
    }

    const shutterSound = new Audio('/images/sound/찰칵!.mp3');
    shutterSound.play().catch(err => console.warn('사운드 재생 실패:', err));

    setShowFlash(true);

    setTimeout(() => {
      setShowFlash(false);
      setTimeout(() => {
        navigate('/email');
      }, 2000);
    }, 500);
  };

  return (
    <div className="photo-background" ref={containerRef} style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#000' }}>
      <div className="photo-frame-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
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
            className={`idol-photo-image idol-position-${name}`}
            onError={() => {
              console.warn(`이미지를 불러올 수 없습니다: ${imgSrc}`);
              setImgSrc('/images/idolPhotos/default_with_frame.png');
            }}
            style={{
              position: 'absolute',
              top: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: '60%',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        )}

        {count !== null && (
          <div className="countdown" style={{
            position: 'absolute',
            fontSize: '5rem',
            color: 'white',
            fontWeight: 'bold',
            textShadow: '0 0 10px black',
            userSelect: 'none',
          }}>
            {count}
          </div>
        )}

        {showFlash && (
          <div className="flash" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            opacity: 0.8,
            pointerEvents: 'none',
          }} />
        )}
      </div>
    </div>
  );
}

export default IdolPhoto;

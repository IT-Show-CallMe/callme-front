import React, { useRef, useEffect } from 'react';
import PhoneLayout from '../../components/Phone';
import IncallPhoneImage from '../../assets/images/call-phone.png';
import IncallBackgroundImage from '../../assets/images/incall-background.png';
import endCallButtonImage from '../../assets/images/call-down.png';
import { useNavigate } from 'react-router-dom';

const Incall = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const handleEndCall = () => {
    navigate('/call/ended');
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('카메라 접근 실패:', err);
      });
  }, []);

  return (
    <PhoneLayout
      hideWings={true}
      hidePhoneImage={true}
      backgroundImage={IncallBackgroundImage}
      phoneImage={null}
      className="incall-page"  
    >
     <div className="dual-phone-container">
  {[1, 2].map((_, idx) => (
    <div className="single-phone" key={idx}>
      <img src={IncallPhoneImage} alt="Phone" className="dual-phone-image" />

      {/* 오른쪽 폰일 때만 카메라 영상 추가 */}
      {idx === 1 && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="self-camera"
        />
      )}

      <img
        src={endCallButtonImage}
        alt="End Call"
        className="end-call-button"
        onClick={handleEndCall}
      />
    </div>
  ))}
</div>
    </PhoneLayout>
  );
};

export default Incall;

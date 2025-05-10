import React, { useRef, useEffect } from 'react';
import IncallPhoneImage from '../../assets/images/call-phone.png';
import IncallBackgroundImage from '../../assets/images/incall-background.png';
import endCallButtonImage from '../../assets/images/call-down.png';
import { useNavigate } from 'react-router-dom';
import SpeechBubble from '../../components/SpeechBubble';
import PhoneLayout from '../../components/Phone';

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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px' }}>
      {/* PhoneLayout에 폰 2개 */}
      <PhoneLayout
        hideWings={true}
        hidePhoneImage={true}
        backgroundImage={IncallBackgroundImage}
        phoneImage={null}
        className="incall-page"
      >
        <div className="dual-phone-container" style={{ display: 'flex', gap: '20px' }}>
          {[1, 2].map((_, idx) => (
            <div className="single-phone" key={idx} style={{ position: 'relative' }}>
              <img src={IncallPhoneImage} alt="Phone" className="dual-phone-image" />
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

      {/* 말풍선 컴포넌트: 폰 2개 오른쪽에 배치 */}
      <div style={{ position: 'absolute', transform: 'translate(145%, -50%)' }}>
        <SpeechBubble
          question="무슨 얘기부터 할까?"
          options={['오늘 어땠어?', '재밌는 일 있어?', '다음 계획은?']}
          onSelect={(option) => console.log('선택한 옵션:', option)}
        />
      </div>
    </div>
  );
};

export default Incall;

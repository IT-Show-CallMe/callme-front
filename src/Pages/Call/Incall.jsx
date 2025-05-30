import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IncallPhoneImage from '../../assets/images/call-phone.png';
import IncallBackgroundImage from '../../assets/images/incall-background.png';
import endCallButtonImage from '../../assets/images/call-down.png';
import SpeechBubble from '../../components/SpeechBubble';
import PhoneLayout from '../../components/Phone';
import idolData from '../../data/idolVideo.json';

const Incall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userCameraRef = useRef(null);

  const name = location.state?.name || '기본값';
  const idol = idolData[name];
  const [currentVideo, setCurrentVideo] = useState(idol.startVideo);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [hasIntroEnded, setHasIntroEnded] = useState(false);
  const [videoKey, setVideoKey] = useState(0);
  const [showWaitingScreen, setShowWaitingScreen] = useState(true);

  const handleEndCall = () => {
    navigate('/call/ended', { state: { name } });
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (userCameraRef.current) {
          userCameraRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error('카메라 접근 실패:', err));

    const timeoutId = setTimeout(() => setShowWaitingScreen(false), 5000);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleVideoEnded = () => {
    if (!hasIntroEnded && currentVideo === idol.startVideo) {
      setHasIntroEnded(true);
    }
    setShowSpeechBubble(true);
  };

  const handleOptionSelect = (selectedMessage) => {
    const matched = idol.messages.find(m => m.message === selectedMessage);
    if (matched?.video) {
      setCurrentVideo(matched.video);
      setVideoKey(prev => prev + 1);
    } else if (selectedMessage === `잘가 ${idol.name}` && idol.endVideo) {
      setCurrentVideo(idol.endVideo);
      setVideoKey(prev => prev + 1);
    }
  };

  const speechOptions = idol.messages.map(m => m.message).concat(idol.endVideo ? '잘가 원빈아' : []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px' }}>
      <PhoneLayout
        hideWings
        hidePhoneImage
        backgroundImage={IncallBackgroundImage}
        className="incall-page"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '50px',
          paddingTop: '100px',
          width: '100vw',
          maxWidth: '150%',
        }}
      >
        <div className="dual-phone-container" style={{ display: 'flex', gap: '20px' }}>
          {[1, 2].map((_, idx) => (
            <div className="single-phone" key={idx} style={{ position: 'relative' }}>
              <img src={IncallPhoneImage} alt="Phone" className="dual-phone-image" />

              {idx === 0 && showWaitingScreen && (
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '18px', color: 'white', fontWeight: 'bold' }}>
                    영상 통화를 준비 중입니다. 잠시만 기다려 주세요...
                  </p>
                  <button
                    onClick={() => setShowWaitingScreen(false)}
                    style={{
                      marginTop: '20px',
                      padding: '10px 20px',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    대기 종료
                  </button>
                </div>
              )}

              {idx === 0 && (
                <video
                  key={videoKey}
                  src={currentVideo}
                  autoPlay
                  playsInline
                  onEnded={handleVideoEnded}
                  onError={(e) => console.error('Video playback error:', e)}
                  className="self-camera"
                />
              )}

              {idx === 1 && (
                <video
                  ref={userCameraRef}
                  autoPlay
                  playsInline
                  muted
                  className="self-camera"
                  style={{ transform: 'scaleX(-1)' }}
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

      {hasIntroEnded && showSpeechBubble && (
        <div style={{ position: 'absolute', transform: 'translate(155%, -50%)' }}>
          <SpeechBubble options={speechOptions} onSelect={handleOptionSelect} />
        </div>
      )}
    </div>
  );
};

export default Incall;
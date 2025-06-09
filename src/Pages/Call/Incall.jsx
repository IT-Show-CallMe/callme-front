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

  // location.state에서 name 받거나 기본값 설정
  const name = location.state?.name || '기본값';
  const idol = idolData[name];

  // idol 데이터 없으면 렌더링 안 하고 안내 메시지 출력
  if (!idol) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '20px', color: 'red' }}>
        아이돌 데이터를 찾을 수 없습니다.<br />
        이름: {name}
      </div>
    );
  }

  const [currentVideo, setCurrentVideo] = useState(idol.startVideo || '');
  const [videoKey, setVideoKey] = useState(0);
  const [hasIntroEnded, setHasIntroEnded] = useState(false);
  const [showWaitingScreen, setShowWaitingScreen] = useState(true);
  const [bubbleVisible, setBubbleVisible] = useState(false);

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
      setBubbleVisible(true);
    } else if (idol.endVideo && currentVideo === idol.endVideo) {
      navigate('/call/ended', { state: { name } });
    }
  };

  const handleOptionSelect = (selectedMessage) => {
    const matched = idol.messages.find(m => m.message === selectedMessage);
    if (matched?.video) {
      setCurrentVideo(matched.video);
      setVideoKey(prev => prev + 1);
    } else if (selectedMessage === `잘가 ${idol.name}` || selectedMessage === `잘가 ${idol.name}야`) {
      if (idol.endVideo) {
        setCurrentVideo(idol.endVideo);
        setVideoKey(prev => prev + 1);
      }
    }
    // 말풍선 유지
  };

  const speechOptions = idol.messages
    .map(m => m.message)
    .filter(msg => msg && msg.trim() !== '')
    .concat(idol.endVideo ? `잘가 ${idol.name}` : []);

  const speechBubbleStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: bubbleVisible ? 'translate(-80%, -50%)' : 'translate(-150%, -50%)',
    transition: 'transform 0.8s ease-in-out',
    zIndex: 1,
  };

  const dualPhoneContainerStyle = {
    display: 'flex',
    gap: '20px',
    transition: 'transform 1s ease-in-out',
    transform: hasIntroEnded ? 'translate(-70%, -90%)' : 'translate(-50%, -90%)',
    position: 'absolute',
    top: '50%',
    left: '50%',
  };

  const handleEndCall = () => {
    navigate('/call/ended', { state: { name } });
  };

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
        <div className="dual-phone-container" style={dualPhoneContainerStyle}>
          {[1, 2].map((_, idx) => (
            <div className="single-phone" key={idx} style={{ position: 'relative' }}>
              <img src={IncallPhoneImage} alt="Phone" className="dual-phone-image" />

              {idx === 0 && showWaitingScreen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: '18px', color: 'white', fontWeight: 'bold' }}>
                    영상 통화를 준비 중입니다. 잠시만 기다려 주세요...
                  </p>
                  <button
                    onClick={() => setShowWaitingScreen(false)}
                    style={{
                      marginTop: '20px',
                      padding: '10px 20px',
                      fontSize: '16px',
                      cursor: 'pointer',
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

      {hasIntroEnded && speechOptions.length > 0 && (
        <div style={speechBubbleStyle}>
          <SpeechBubble options={speechOptions} onSelect={handleOptionSelect} />
        </div>
      )}

      <p
        style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'Pretendard',
          fontWeight: 300,
          color: '#BDBDBD',
          fontSize: '20px',
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        빨간버튼을 누르시면 자동으로 끊어집니다.
      </p>
    </div>
  );
};

export default Incall;

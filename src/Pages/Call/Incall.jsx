import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IncallPhoneImage from '../../assets/images/call-phone.png';
import IncallBackgroundImage from '../../assets/images/incall-background.png';
import endCallButtonImage from '../../assets/images/call-down.png';
import SpeechBubble from '../../components/SpeechBubble';
import PhoneLayout from '../../components/Phone';

import wonbinIntro from '../../assets/videos/wonbin-intro.mp4';
import wonbinOptionA from '../../assets/videos/wonbin-flirting.mp4';
import wonbinOptionB from '../../assets/videos/wonbin-mbti.mp4';
import wonbinOptionC from '../../assets/videos/wonbin-bluescreen.mp4';

const videoMap = {
  wonbin: {
    intro: [wonbinIntro],
    optionA: [wonbinOptionA],
    optionB: [wonbinOptionB],
    optionC: [wonbinOptionC],
  }
};

const Incall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userCameraRef = useRef(null);

  const name = location.state?.name || 'wonbin';
  const [currentVideo, setCurrentVideo] = useState(videoMap[name].intro);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [videoKey, setVideoKey] = useState(0); // 재렌더링 유도
  const [showWaitingScreen, setShowWaitingScreen] = useState(true); // 대기화면 상태

  const handleEndCall = () => {
    navigate('/call/ended');
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (userCameraRef.current) {
          userCameraRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('카메라 접근 실패:', err);
      });

    // 5초 후 대기화면 종료
    const timeoutId = setTimeout(() => {
      setShowWaitingScreen(false); // 대기화면 종료
    }, 5000);

    // 컴포넌트 언마운트 시 타임아웃 클리어
    return () => clearTimeout(timeoutId);
  }, []);

  const handleVideoEnded = () => {
    setShowSpeechBubble(true);
  };

  const getOptionKey = (optionText) => {
    switch (optionText) {
      case '앞니 플러팅 해줘':
        return 'optionA';
      case 'mbti 뭐야?':
        return 'optionB';
      case '블루 스크린 해줘':
        return 'optionC';
      default:
        return 'intro';
    }
  };

  const handleOptionSelect = (option) => {
    const key = getOptionKey(option);
    const nextVideo = videoMap[name][key];
    if (nextVideo) {
      setCurrentVideo(nextVideo);
      setVideoKey(prev => prev + 1);
    }
    setShowSpeechBubble(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px' }}>
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

              {/* 왼쪽 폰 화면에 대기 문구 및 버튼 추가 */}
              {idx === 0 && showWaitingScreen && (
                <div className="waiting-screen" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <p style={{ fontSize: '18px', color: 'white', fontWeight: 'bold' }}>영상 통화를 준비 중입니다. 잠시만 기다려 주세요...</p>
                  <button
                    onClick={() => setShowWaitingScreen(false)}
                    style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
                  >
                    대기 종료
                  </button>
                </div>
              )}

              {/* 상대 영상 */}
              {idx === 0 && (
                <video
                  key={videoKey}
                  src={currentVideo}
                  autoPlay
                  playsInline
                  onEnded={handleVideoEnded}
                  className="self-camera"
                />
              )}

              {/* 내 카메라 */}
              {idx === 1 && (
                <video
                  ref={userCameraRef}
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

      {showSpeechBubble && (
        <div style={{ position: 'absolute', transform: 'translate(145%, -50%)' }}>
          <SpeechBubble
            options={['앞니 플러팅 해줘', 'mbti 뭐야?', '블루 스크린 해줘']}
            onSelect={handleOptionSelect}
          />
        </div>
      )}
    </div>
  );
};

export default Incall;

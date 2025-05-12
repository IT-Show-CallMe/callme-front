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
import wonbinOptionD from '../../assets/videos/wonbin-jjol.mp4';
import wonbinOptionE from '../../assets/videos/wonbin-what.mp4';
import wonbinOptionF from '../../assets/videos/wonbin-bye.mp4';

const videoMap = {
  wonbin: {
    intro: [wonbinIntro],
    optionA: [wonbinOptionA],
    optionB: [wonbinOptionB],
    optionC: [wonbinOptionC],
    optionD: [wonbinOptionD],
    optionE: [wonbinOptionE],
    optionF: [wonbinOptionF],
  },
};

const Incall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userCameraRef = useRef(null);

  const name = location.state?.name || 'wonbin';
  const [currentVideo, setCurrentVideo] = useState(videoMap[name].intro);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [hasIntroEnded, setHasIntroEnded] = useState(false); // 인트로 종료 여부
  const [videoKey, setVideoKey] = useState(0); // 재렌더링 유도
  const [showWaitingScreen, setShowWaitingScreen] = useState(true); // 대기화면 상태

  const handleEndCall = () => {
    console.log('Navigating to /call/ended');
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

    const timeoutId = setTimeout(() => {
      setShowWaitingScreen(false);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleVideoEnded = () => {
    if (!hasIntroEnded && currentVideo[0] === videoMap[name].intro[0]) {
      setHasIntroEnded(true); // 인트로 종료 표시
    }
    setShowSpeechBubble(true); // 항상 말풍선 표시
  };

  const getOptionKey = (optionText) => {
    switch (optionText) {
      case '앞니 플러팅 해줘':
        return 'optionA';
      case 'mbti 뭐야?':
        return 'optionB';
      case '블루 스크린 해줘':
        return 'optionC';
      case '원빈아 쫄았니':
        return 'optionD';
      case '팔찌 뭐야?':
        return 'optionE';
        case '잘가 원빈아':
          return 'optionF';
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
   
  };

  const speechOptions = [
    '앞니 플러팅 해줘',
    'mbti 뭐야?',
    '블루 스크린 해줘',
    '원빈아 쫄았니',
    '팔찌 뭐야?',
    '잘가 원빈아',
  ];

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

              {/* 대기 화면 */}
              {idx === 0 && showWaitingScreen && (
                <div
                  className="waiting-screen"
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

              {/* 상대방 영상 */}
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
                  style={{ transform: 'scaleX(-1)' }} // 좌우반전
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

        {/* 말풍선: 인트로 영상 이후 항상 표시 */}
        {hasIntroEnded && showSpeechBubble && (
        <div style={{ position: 'absolute', transform: 'translate(145%, -50%)' }}>
          <SpeechBubble options={speechOptions} onSelect={handleOptionSelect} />
        </div>
      )}
    </div>
  );
};


export default Incall;

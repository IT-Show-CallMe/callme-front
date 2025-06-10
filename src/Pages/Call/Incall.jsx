import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import IncallPhoneImage from '../../assets/images/call-phone.png';
import IncallBackgroundImage from '../../assets/images/incall-background.png';
import endCallButtonImage from '../../assets/images/call-down.png';
import SpeechBubble from '../../components/SpeechBubble';
import PhoneLayout from '../../components/Phone';
// import idolData from '../../data/idolVideo.json';  // 이제 사용 안함

const SERVER_BASE_URL = 'http://localhost:3000';

const Incall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userCameraRef = useRef(null);

  // location.state에서 name 받거나 기본값 설정
  const name = location.state?.name || '기본값';

  // 상태 선언
  const [idolId, setIdolId] = useState(null);
  const [idolInfo, setIdolInfo] = useState(null);
  const [currentVideo, setCurrentVideo] = useState('');
  const [videoKey, setVideoKey] = useState(0);
  const [hasIntroEnded, setHasIntroEnded] = useState(false);
  const [showWaitingScreen, setShowWaitingScreen] = useState(true);
  const [bubbleVisible, setBubbleVisible] = useState(false);

  // 1. /idol/all 에서 id와 기타 정보 가져오기 (idolName === name 매칭)
  useEffect(() => {
    const fetchIdolList = async () => {
      try {
        const res = await axios.get(`${SERVER_BASE_URL}/idol/all`);
        const matched = res.data.find((item) => item.idolName === name);
        if (matched) {
          setIdolId(matched.id);
          setIdolInfo(matched);
        } else {
          console.warn('아이돌 이름과 일치하는 항목을 찾을 수 없습니다:', name);
        }
      } catch (err) {
        console.error('아이돌 리스트 로드 실패:', err);
      }
    };

    fetchIdolList();
  }, [name]);

  useEffect(() => {
  if(currentVideo) {
    console.log('currentVideo URL:', currentVideo);
  }
}, [currentVideo]);

  // 2. idolId가 있으면 /idol/intro/:id 에서 intro 영상 URL 가져오기 (절대경로로 변환)
  useEffect(() => {
    const fetchIntroVideo = async () => {
      if (!idolId) return;
      try {
        const response = await axios.get(`${SERVER_BASE_URL}/idol/intro/${idolId}`);
        const introPath = response.data.intro; // 상대 경로 예: uploads/intro/정재현-인트로.mp4
        if (introPath) {
          setCurrentVideo(`${SERVER_BASE_URL}/${introPath}`);
        }
      } catch (err) {
        console.error('인트로 영상 로딩 실패:', err);
      }
    };

    fetchIntroVideo();
  }, [idolId]);

  // 3. 카메라 접근 및 대기 화면 처리
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

  // 4. 말풍선 관련 (idolInfo.messages 및 endVideo는 DB에서 별도 로딩 필요 - 현재는 임시 빈 배열로 대체)
  const messages = idolInfo?.messages || [];
  const endVideoPath = idolInfo?.endVideo || '';
  const endVideo = endVideoPath ? `${SERVER_BASE_URL}/${endVideoPath}` : '';

  const handleVideoEnded = () => {
    if (!hasIntroEnded && currentVideo === (idolInfo?.intro ? `${SERVER_BASE_URL}/${idolInfo.intro}` : currentVideo)) {
      setHasIntroEnded(true);
      setBubbleVisible(true);
    } else if (endVideo && currentVideo === endVideo) {
      navigate('/call/ended', { state: { name } });
    }
  };

  const handleOptionSelect = (selectedMessage) => {
    // 메시지에 매칭되는 비디오가 있는지 찾기 (임시 처리)
    const matched = messages.find((m) => m.message === selectedMessage);
    if (matched?.video) {
      setCurrentVideo(`${SERVER_BASE_URL}/${matched.video}`);
      setVideoKey((prev) => prev + 1);
    } else if (selectedMessage === `잘가 ${name}` || selectedMessage === `잘가 ${name}야`) {
      if (endVideo) {
        setCurrentVideo(endVideo);
        setVideoKey((prev) => prev + 1);
      }
    }
    // 말풍선 유지
  };

  const speechOptions = messages
    .map((m) => m.message)
    .filter((msg) => msg && msg.trim() !== '')
    .concat(endVideo ? `잘가 ${name}` : []);

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

  if (!idolInfo) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100, fontSize: 20, color: 'gray' }}>
        아이돌 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 50 }}>
      <PhoneLayout
        hideWings
        hidePhoneImage
        backgroundImage={IncallBackgroundImage}
        className="incall-page"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 50,
          paddingTop: 100,
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
                  <p style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>
                    영상 통화를 준비 중입니다. 잠시만 기다려 주세요...
                  </p>
                  <button
                    onClick={() => setShowWaitingScreen(false)}
                    style={{
                      marginTop: 20,
                      padding: '10px 20px',
                      fontSize: 16,
                      cursor: 'pointer',
                    }}
                  >
                    대기 종료
                  </button>
                </div>
              )}

              {idx === 0 && currentVideo && (
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
          bottom: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'Pretendard',
          fontWeight: 300,
          color: '#BDBDBD',
          fontSize: 20,
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

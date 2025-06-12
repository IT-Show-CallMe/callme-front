import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import IncallPhoneImage from '../../assets/images/call-phone.png';
import IncallBackgroundImage from '../../assets/images/incall-background.png';
import endCallButtonImage from '../../assets/images/call-down.png';
import SpeechBubble from '../../components/SpeechBubble';
import PhoneLayout from '../../components/Phone';

const BASE_URL = "http://localhost:3000/";

const Incall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userCameraRef = useRef(null);

  const name = location.state?.name || '기본값';

  const [idolId, setIdolId] = useState(null);
  const [idolInfo, setIdolInfo] = useState(null);
  const [choices, setChoices] = useState([]); // 말풍선 선택지
  const [currentVideo, setCurrentVideo] = useState('');
  const [videoKey, setVideoKey] = useState(0);
  const [hasIntroEnded, setHasIntroEnded] = useState(false);
  const [showWaitingScreen, setShowWaitingScreen] = useState(true);
  const [bubbleVisible, setBubbleVisible] = useState(false);

  // 1. 아이돌 리스트에서 id 찾기
  useEffect(() => {
    const fetchIdolList = async () => {
      try {
        const res = await axios.get(`${BASE_URL}idol/all`);
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

  // 2. intro 영상 가져오기
  useEffect(() => {
    const fetchIntroVideo = async () => {
      if (!idolId) return;
      try {
        const response = await axios.get(`${BASE_URL}idol/intro/${idolId}`);
        const introUrl = response.data.intro.startsWith('http')
          ? response.data.intro
          : BASE_URL + response.data.intro;
        setCurrentVideo(introUrl);
      } catch (err) {
        console.error('인트로 영상 로딩 실패:', err);
      }
    };
    fetchIntroVideo();
  }, [idolId]);

  // 3. 말풍선 선택지 가져오기
  useEffect(() => {
    const fetchChoices = async () => {
      if (!idolId) return;
      try {
        const res = await axios.get(`${BASE_URL}idolVideo/choices/${idolId}`);
        setChoices(res.data || []);
      } catch (err) {
        console.error('말풍선 선택지 로딩 실패:', err);
      }
    };
    fetchChoices();
  }, [idolId]);

  // 4. 카메라 및 대기화면
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

// useEffect(() => {
//   if (window.ringingAudio) {
//     window.ringingAudio.pause();
//     window.ringingAudio.currentTime = 0;
//     window.ringingAudio = null;
//     console.log('incall 페이지 진입 시 벨소리 멈춤');
//   }
// }, []);

  // 5. 영상 종료 이벤트
  const endVideoRaw = idolInfo?.endVideo || '';
  const endVideo = endVideoRaw.startsWith('http')
    ? endVideoRaw
    : BASE_URL + endVideoRaw;

  const handleVideoEnded = () => {
    if (!hasIntroEnded && currentVideo === (idolInfo?.intro || currentVideo)) {
      setHasIntroEnded(true);
      setBubbleVisible(true);
    } else if (endVideo && currentVideo === endVideo) {
      navigate('/call/ended', { state: { name } });
    }
  };

  // 6. 말풍선 선택지 클릭 핸들러
  const handleOptionSelect = async (selectedChoiceText) => {
    // 선택한 텍스트에 대응하는 choice 객체 찾기
    const selectedChoice = choices.find((c) => c.choices === selectedChoiceText);

    if (selectedChoice) {
      try {
        // 선택한 choice id로 비디오 URL 요청
        const res = await axios.get(`${BASE_URL}idolVideo/video/${selectedChoice.id}`);
        const videoUrlRaw = res.data.videos;
        const videoUrl = videoUrlRaw.startsWith('http') ? videoUrlRaw : BASE_URL + videoUrlRaw;
        setCurrentVideo(videoUrl);
        setVideoKey((prev) => prev + 1);
      } catch (err) {
        console.error('선택지 영상 로딩 실패:', err);
      }
    } else if (selectedChoiceText === '잘 가' || selectedChoiceText === `잘 가 ${name}`) {
      if (endVideo) {
        setCurrentVideo(endVideo);
        setVideoKey((prev) => prev + 1);
      }
    }
  };

// 말풍선 옵션 배열 생성
const speechOptions = choices
  .map((c) => c.choices)
  .filter((msg) => msg && msg.trim() !== '');

const hasFarewell = speechOptions.some(msg => msg.replace(/\s/g, '').includes('잘가'));
const hasBbye = speechOptions.some(msg => msg.replace(/\s/g, '').includes('빠잉'));

// 빠잉 없고, 잘 가도 없을 때만 잘 가 추가
if (endVideo && !hasFarewell && !hasBbye) {
  speechOptions.push('잘 가');
}


  // 스타일 정의는 기존과 동일
  const speechBubbleStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: bubbleVisible
      ? 'translate(-80%, -50%)'
      : 'translate(-150%, -50%)',
    transition: 'transform 0.8s ease-in-out',
    zIndex: 1,
  };

  const dualPhoneContainerStyle = {
    display: 'flex',
    gap: '20px',
    transition: 'transform 1s ease-in-out',
    transform: hasIntroEnded
      ? 'translate(-70%, -90%)'
      : 'translate(-50%, -90%)',
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
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 50 }}
    >
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
    </div>
  );
};

export default Incall;

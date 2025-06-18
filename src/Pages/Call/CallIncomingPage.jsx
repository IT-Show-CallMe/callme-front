import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import PhoneLayout from '../../components/Phone';
import startButtonImage from '../../assets/images/button-yes.png';
import backButtonImage from '../../assets/images/button-no.png';
import defaultPhoneImage from '../../assets/images/phone.png';
import 'bootstrap-icons/font/bootstrap-icons.css';

function CallIncomingPage() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [idol, setIdol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 페이지 진입 시 아이돌 데이터 요청 + 벨소리 정지 처리
  useEffect(() => {
    const fetchIdol = async () => {
      try {
        const response = await axios.get(`api/intro/${encodeURIComponent(name)}`);
        setIdol(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdol();

    // // 벨소리 정지 및 초기화 (안정성 위해 항상 실행)
    // if (window.ringingAudio) {
    //   window.ringingAudio.pause();
    //   window.ringingAudio.currentTime = 0;
    //   window.ringingAudio = null;
    //   console.log('페이지 진입 시 기존 벨소리 멈춤');
    // }
  }, [name]);

  //   // 벨소리 재생 시도
  // if (!window.ringingAudio) {
  //   const audio = new Audio('/images/sound/따르릉.mp3');
  //   audio.loop = true;
  //   audio.volume = 1.0;
  //   window.ringingAudio = audio;
  //   audio.play().then(() => {
  //     console.log('✅ 벨소리 재생 시작');
  //   }).catch(e => {
  //     console.warn('❌ 벨소리 재생 실패:', e);
  //   });
  // }
  useEffect(() => {
    const audio = new Audio('/images/sound/따르릉.mp3');
    audio.loop = true;
    audio.volume = 1.0;
    window.ringingAudio = audio;
    audio.play().then(() => {
      console.log('✅ 벨소리 재생 시작');
    }).catch(e => {
      console.warn('❌ 벨소리 재생 실패:', e);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [])


  // 뒤로 가기 버튼
  const handleGoBack = () => {
    navigate(-1);
  };

  // 아이돌 목록으로 이동
  const handleGoToIdolList = () => {
    navigate('/idol');
  };

  // 응답 버튼 클릭 시 벨소리 정지 + 로컬 저장소 기록 + 화면 전환
  const handleStartCall = async () => {
    console.log('응답 버튼 눌림, 벨소리 멈춤 시도');
    if (window.ringingAudio) {
      window.ringingAudio.pause();
      window.ringingAudio.currentTime = 0;
      window.ringingAudio = null;
      console.log('벨소리 오디오 객체 발견, 정지시킴');
    } else {
      console.log('벨소리 오디오 객체 없음');
    }

    try {
      // 클릭 수 증가 API 호출 (idol.id 사용)
      await axios.get(`api/idol/click/${idol.id}`);
      console.log('클릭 수 증가 성공');
    } catch (err) {
      console.error('클릭 수 증가 실패:', err);
    }

    // 통화 기록 로컬저장소에 저장
    const now = new Date().toISOString();
    const storedData = JSON.parse(localStorage.getItem("idolData")) || {};
    if (storedData[name]) {
      storedData[name].callCount = (storedData[name].callCount || 0) + 1;
      storedData[name].lastCallTime = now;
    } else {
      storedData[name] = {
        callCount: 1,
        lastCallTime: now,
      };
    }
    localStorage.setItem("idolData", JSON.stringify(storedData));

    // 화면 전환 애니메이션 및 네비게이트
    setIsTransitioning(true);
    setTimeout(() => {
      navigate(`/call/incall/${name}`, { state: { name, id: idol.id } });
    }, 600);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error || !idol) {
    return <div>해당 아이돌 데이터를 불러오지 못했습니다. 이름: {name}</div>;
  }

  return (
    <div
      className={`transition-wrapper ${isTransitioning ? 'zoom-out' : ''}`}
      style={{ cursor: 'pointer' }}
    >
      {/* 아이돌 목록 돌아가기 버튼 */}
      <div
        style={{
          position: 'absolute',
          top: '90px',
          left: '80px',
          zIndex: 10,
          cursor: 'pointer'
        }}
        onClick={(e) => { e.stopPropagation(); handleGoToIdolList(); }}
      >
        <i className="bi bi-chevron-left" style={{ fontSize: '4rem', color: '#358CCA' }}></i>
      </div>

      <PhoneLayout
        message={name}
        phoneImage={defaultPhoneImage}
        phoneImageClassName="shaking-phone"
        shakeAll={true}
      >
        <div className="phone-buttons shaking-phone" onClick={e => e.stopPropagation()}>
          <img
            src={backButtonImage}
            alt="Go Back"
            onClick={handleGoBack}
            style={{ width: '80%', height: '80%', cursor: 'pointer' }}
          />
          <img
            src={startButtonImage}
            alt="Start Call"
            onClick={handleStartCall}
            style={{ width: '80%', height: '40%', cursor: 'pointer' }}
          />
        </div>
      </PhoneLayout>
    </div>
  );
}

export default CallIncomingPage;

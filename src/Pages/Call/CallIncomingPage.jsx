import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; // axios 추가
import PhoneLayout from '../../components/Phone';
import startButtonImage from '../../assets/images/button-yes.png';
import backButtonImage from '../../assets/images/button-no.png';
import defaultPhoneImage from '../../assets/images/phone.png';
import 'bootstrap-icons/font/bootstrap-icons.css';

function CallIncomingPage() {
  const { name } = useParams(); // URL에서 :name 추출
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [idol, setIdol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 👇 name(한글) URL 인코딩
    const fetchIdol = async () => {
      try {
        const response = await axios.get(`api/intro/${encodeURIComponent(name)}`);
        setIdol(response.data); // 서버에서 intro 정보만 오니까 intro 속성
      } catch (err) {
        console.error("아이돌 데이터를 불러오는데 실패했어요.", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIdol();
  }, [name]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error || !idol) {
    return <div>해당 아이돌 데이터를 불러오지 못했습니다. 이름: {name}</div>;
  }

  // 👇 아이콘 클릭 시 /idol 페이지로 이동하는 함수
  const handleGoToIdolList = () => {
    navigate('/idol');
  };

  const handleStartCall = () => {
      console.log('idol:', idol);
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
    console.log("Updated call data:", storedData[name]);
    setIsTransitioning(true);
    setTimeout(() => {
     navigate(`/call/incall/${name}`, { state: { name, id: idol.id } }); 
    }, 600);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={`transition-wrapper ${isTransitioning ? 'zoom-out' : ''}`}>
      <div
        style={{
          position: 'absolute',
          top: '90px',
          left: '80px',
          zIndex: 10,
          cursor: 'pointer'
        }}
        onClick={handleGoToIdolList}
      >
        <i className="bi bi-chevron-left" style={{ fontSize: '4rem', color: '#358CCA' }}></i>
      </div>

      <PhoneLayout
        message={name}
        phoneImage={defaultPhoneImage}
        phoneImageClassName="shaking-phone"
        shakeAll={true}
      >
        <div className="phone-buttons shaking-phone">
          <img
            src={backButtonImage}
            alt="Go Back"
            onClick={handleGoBack}
            style={{ width: '80%', height: '80%' }}
          />
          <img
            src={startButtonImage}
            alt="Start Call"
            onClick={handleStartCall}
            style={{ width: '80%', height: '40%' }}
          />
        </div>
      </PhoneLayout>
    </div>
  );
}

export default CallIncomingPage;

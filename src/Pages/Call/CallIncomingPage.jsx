import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PhoneLayout from '../../components/Phone';
import startButtonImage from '../../assets/images/button-yes.png';
import backButtonImage from '../../assets/images/button-no.png';
import defaultPhoneImage from '../../assets/images/phone.png';
import idolData from '../../data/idolVideo.json';
import 'bootstrap-icons/font/bootstrap-icons.css';


function CallIncomingPage() {
  const { name } = useParams(); // URL에서 :name 추출
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const idol = idolData[name]; // JSON에서 해당 아이돌 정보 가져오기

  if (!idol) {
    return <div>해당 아이돌 데이터가 없습니다. 이름: {name}</div>;
  }

  
  // 👇 아이콘 클릭 시 /idol 페이지로 이동하는 함수
  const handleGoToIdolList = () => {
    navigate('/idol');
  };

  const handleStartCall = () => {
    const now = new Date().toISOString();
    // local불러오기
    const storedData = JSON.parse(localStorage.getItem("idolData")) || {};
    if (storedData[name]) {
      storedData[name].callCount = (storedData[name].callCount || 0) + 1;
      storedData[name].lastCallTime = now
    } else {
      storedData[name] = {
        callCount: 1,
        lastCallTime: now,
      };
    }
    // 수정하면 저장
    localStorage.setItem("idolData", JSON.stringify(storedData));
    console.log("Updated call data:", storedData[name]);  // 여기에 출력!
    setIsTransitioning(true);
    setTimeout(() => {
      // state에 name 넘겨주기 추가
      navigate(`/call/incall/${name}`, { state: { name } });
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
        message={idol.name} // JSON의 이름 사용
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

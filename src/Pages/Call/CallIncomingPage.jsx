import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneLayout from '../../components/Phone';
import startButtonImage from '../../assets/images/button-yes.png';
import backButtonImage from '../../assets/images/button-no.png';
import defaultPhoneImage from '../../assets/images/phone.png';


function CallIncomingPage() {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStartCall = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/call/incall');
    }, 600); // 애니메이션 시간과 일치
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={`transition-wrapper ${isTransitioning ? 'zoom-out' : ''}`}>
      <PhoneLayout
        message="원빈"
        phoneImage={defaultPhoneImage}
        phoneImageClassName="shaking-phone"
        shakeAll={true}
      >
       <div className="phone-buttons shaking-phone"> {/* 애니메이션 클래스 추가 */}
    <img src={backButtonImage} alt="Go Back" onClick={handleGoBack} />
    <img src={startButtonImage} alt="Start Call" onClick={handleStartCall} />
  </div>
      </PhoneLayout>
    </div>
  );
}

export default CallIncomingPage;

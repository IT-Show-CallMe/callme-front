import React from 'react';
import PhoneLayout from '../../components/Phone';
import IncallPhoneImage from '../../assets/images/call-phone.png';
import IncallBackgroundImage from '../../assets/images/incall-background.png';
import endCallButtonImage from '../../assets/images/call-down.png';
import { useNavigate } from 'react-router-dom';


const Incall = () => {
  const navigate = useNavigate();

  const handleEndCall = () => {
    navigate('/call/ended'); 
  };

  return (
    <PhoneLayout 
      message="소희와 통화 중...!" 
      hideWings={true} 
      phoneImage={IncallPhoneImage}
      backgroundImage={IncallBackgroundImage}
    >
      <div className="incall-end-button-wrapper">
        <img 
          src={endCallButtonImage} 
          alt="End Call" 
          className="end-call-button" 
          onClick={handleEndCall}
        />
      </div>
    </PhoneLayout>
  );
};

export default Incall;

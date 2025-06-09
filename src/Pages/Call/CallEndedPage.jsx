// CallEndedPage.js
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import callEndedIcon from '../../assets/images/wings.png';

const CallEndedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state?.name || '기본값';

  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Modak&display=swap";
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="callEndedContainer">
      <div className="callEndedImageContainer">
        <img src={callEndedIcon} alt="Call Ended" className="callEndedImage" />
        <div className="callEndedText">
          <div className="mainMessage">영상통화가 종료 되었습니다.</div>
          <div className="subMessage">당신의 아이돌과 사진을 찍고 싶다면<br /> '예'를 눌러주세요.</div>
        </div>
        <div className="buttonContainer">
          <button className="yesButton" onClick={() => navigate('/letter')}>
            아니오
          </button>
          <button
            className="noButton"
            onClick={() => navigate('/email', { state: { name } })} // name 전달
          >
            예
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallEndedPage;

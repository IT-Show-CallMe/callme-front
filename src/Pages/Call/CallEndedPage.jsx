// CallEndedPage.jsx
import React, { useEffect } from 'react';
import "../../styles/incall.css"; // CSS 파일을 불러옵니다.
import { useNavigate } from 'react-router-dom';
import callEndedIcon from '../../assets/images/wings.png'; // 중앙 이미지만 import
import buttonImage1 from '../../assets/images/yes.png';
import buttonImage2 from '../../assets/images/no.png'




const CallEndedPage = () => {

  const navigate = useNavigate();

  useEffect(() => {
    // Google Fonts 링크를 head에 추가
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Modak&display=swap";
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (

    <div className="callEndedContainer">
      <div className="callEndedImageContainer">
        <img
          src={callEndedIcon}
          alt="Call Ended"
          className="callEndedImage"
        />
        <div className="callEndedText">
          <div className="mainMessage">영상통화가 종료 되었습니다.</div>
          <div className="subMessage">당신의 아이돌과 사진을 찍고 싶다면<br /> '예'를 눌러주세요.</div>
        </div>
        <div className="buttonContainer">
          <button
            className="yesButton"
            onClick={() => navigate('/letter')}
          >
            아니오
          </button>
          <button
            className="noButton"
            onClick={() => console.log('아니오 버튼 클릭')}
          >
            예
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallEndedPage;
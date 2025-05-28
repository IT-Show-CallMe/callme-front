// CallEndedPage.jsx
import React, { useEffect } from 'react';
import "../../styles/incall.css"; // CSS 파일을 불러옵니다.
import { useNavigate } from 'react-router-dom';
import callEndedIcon from '../../assets/images/wings.png'; // 중앙 이미지만 import
import buttonImage1 from '../../assets/images/yes.png'; 
import buttonImage2 from '../../assets/images/no.png'


const CallEndedPage = () => {


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
        <div className="callEndedText">Do your like this?</div> {/* 중앙 텍스트 */}

        <div className="buttonContainer">
          <img 
            src={buttonImage1} 
            alt="Button 1" 
            className="buttonImage" 
            onClick={() => console.log('Button 1 clicked')}
          />
          <img 
            src={buttonImage2} 
            alt="Button 2" 
            className="buttonImage" 
            onClick={() => console.log('Button 2 clicked')}
          />
        </div>
      </div>
    </div>
  );
};

export default CallEndedPage;
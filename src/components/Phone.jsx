import React from 'react';
import "../styles/incall.css";
import phoneImage from '../assets/images/phone.png';
import leftWingImage from '../assets/images/wing-left.png'; // 왼쪽 날개 이미지 경로
import rightWingImage from '../assets/images/wing-right.png'; // 오른쪽 날개 이미지 경로

const Phone = ({ children, message }) => {
    return (
      <div className="background-image">
        <img src={leftWingImage} alt="Left Wing" className="wing left-wing" />
        <img src={phoneImage} alt="Phone" className="phone-image" />
        <img src={rightWingImage} alt="Right Wing" className="wing right-wing" />
        <div className="phone-text">{message}</div>
  
        {/* 이 안에 폰 화면 콘텐츠 들어감 */}
        <div className="phone-content">{children}</div>
      </div>
    );
  };
  
  export default Phone;
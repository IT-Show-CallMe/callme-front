import React from 'react';
import "../styles/incall.css";
import phoneImage from '../assets/images/phone.png';
import leftWingImage from '../assets/images/wing-left.png';
import rightWingImage from '../assets/images/wing-right.png';


const Phone = ({
  children,
  message,
  hideWings = false,
  backgroundImage,
  phoneImage = phoneImageDefault,
  phoneImageClassName,
  shakeAll = false // 전체 진동 옵션
}) => {
  return (
    <div
      className="background-image"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <div className="phone-wrapper">
        {!hideWings && <img src={leftWingImage} alt="Left Wing" className="wing left-wing" />}

        <div className={`phone-container ${shakeAll ? 'shaking-phone' : ''}`}>
          <img
            src={phoneImage}
            alt="Phone"
            className={`phone-image ${phoneImageClassName || ''}`}
          />

          {message && (
            <div className="phone-text">
              {message}
            </div>
          )}

          <div className="phone-buttons">
            {children}
          </div>
        </div>

        {!hideWings && <img src={rightWingImage} alt="Right Wing" className="wing right-wing" />}
      </div>
    </div>
  );
};
export default Phone;

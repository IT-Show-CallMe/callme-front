import React from 'react';
import "../styles/incall.css";
import phoneImageDefault from '../assets/images/phone.png';
import leftWingImage from '../assets/images/wing-left.png';
import rightWingImage from '../assets/images/wing-right.png';

const Phone = ({
  children,
  message,
  hideWings = false,
  hidePhoneImage = false,
  backgroundImage,
  phoneImage = phoneImageDefault,
  phoneImageClassName,
  shakeAll = false
}) => {
  return (
    <div
      className="background-image"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <div className="phone-wrapper">
        {!hideWings && (
          <img src={leftWingImage} alt="Left Wing" className="wing left-wing" />
        )}

        <div className={`phone-container ${shakeAll ? 'shaking-phone' : ''}`}>
          {!hidePhoneImage && (
            <img
              src={phoneImage}
              alt="Phone"
              className={`phone-image ${phoneImageClassName || ''}`}
            />
          )}

          {message && (
            <div className="phone-text">
              {message}
            </div>
          )}

          {/* ✅ 버튼(children) 폰 내부에 고정 */}
          <div className="phone-children-inside">
            {children}
          </div>
        </div>

        {!hideWings && (
          <img src={rightWingImage} alt="Right Wing" className="wing right-wing" />
        )}
      </div>
    </div>
  );
};

export default Phone;

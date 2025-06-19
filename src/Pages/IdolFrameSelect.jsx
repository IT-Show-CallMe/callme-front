import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/idolFrameSelect.css";

function IdolFrameSelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, email } = location.state || {};
  
const handlePhoto1Click = () => {
  navigate(`/photo/${name}`, { state: { email, frame: "cute" } });
};

const handlePhoto2Click = () => {
  navigate(`/photo/${name}`, { state: { email, frame: "default" } });
};


  return (
    <div className="photo-background">
      <div className="frame-selection-wrapper">
        <div className="photo-container">
      <img
  src="/images/idolPhotos/cute-frame.png"
  alt="사진1"
  className="idol-photo1"
  onClick={handlePhoto1Click}
  style={{ cursor: "pointer" }}
/>
<img
  src="/images/idolPhotos/frame.png"
  alt="사진2"
  className="idol-photo2"
  onClick={handlePhoto2Click}
  style={{ cursor: "pointer" }}
/>
        </div>
        <p className="instruction-text">당신의 아이돌과 함께 할 프레임을 선택하세요</p>
      </div>
    </div>
  );
}

export default IdolFrameSelect;

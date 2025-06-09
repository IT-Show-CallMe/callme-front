// EmailInput.js
import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

import "../styles/emailInput.css";
import BackgroundImage from "../components/Nickname/BackgroundImage";
import AngyeongMandoo from "../components/Nickname/AngyeongMandoo";
import WindowFrame from "../components/Nickname/WindowFrame";

function EmailInput() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state?.name || '기본값'; // CallEndedPage에서 받은 이름

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    if (!email) {
      alert("이메일을 입력해주세요!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식을 입력해주세요!");
      return;
    }

    try {
      const response = await axios.post("/api/email", { email });
      alert(response.data);
      setEmail("");
      // 이메일 저장 성공 시 사진 찍는 페이지로 이동, 이름도 같이 넘기기
      navigate(`/photo/${name}`, { state: { email } });
    } catch (error) {
      console.error("이메일 저장 실패:", error);
      alert("이메일 저장 중 오류가 발생하였습니다. 다시 시도하세요.");
    }
  };

  return (
    <div className="container">
      <BackgroundImage />
      <div className="window">
        <WindowFrame />
        <div className="window-content">
          <p className="input-title">이메일을 입력하세요.</p>
          <input
            type="text"
            placeholder="이메일을 입력하세요."
            className="input-email"
            value={email}
            onChange={handleInputChange}
          />
          <button className="confirm-button" onClick={handleSubmit}>
            확인
          </button>
        </div>
        <AngyeongMandoo />
      </div>
    </div>
  );
}

export default EmailInput;

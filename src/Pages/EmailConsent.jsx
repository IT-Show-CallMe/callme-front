// EmailConsentPage.js
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import callEndedIcon from "../assets/images/wings.png";

const EmailConsent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state?.name || "기본값";

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Modak&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  
      useEffect(() => {
      let countdown = 60; // 60초
      const intervalId = setInterval(() => {
          countdown -= 1;
  
          console.clear(); // 콘솔 지우기
          console.log(`⏳ 랜딩페이지 자동 이동까지 남은 시간: ${countdown}초`);
  
          if (countdown <= 0) {
              clearInterval(intervalId);
              navigate('/'); // 랜딩페이지로 이동
          }
      }, 1000); // 1초마다 실행
  
      return () => clearInterval(intervalId);
  }, [navigate]);
  return (
    <div className="callEndedContainer">
      <div className="callEndedImageContainer">
        <img src={callEndedIcon} alt="Email Consent" className="callEndedImage" />
        <div className="callEndedText">
          <div className="mainMessage">사진 전송을 위해 이메일 <br/>수집에 동의하십니까?</div>
        </div>
        <div className="buttonContainer">
          <button className="yesButton" onClick={() => navigate("/letter")}>
            아니오
          </button>
          <button
            className="noButton"
            onClick={() => navigate("/email", { state: { name } })}
          >
            예
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailConsent;

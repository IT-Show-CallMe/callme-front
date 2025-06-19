import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import callEndedIcon from "../assets/images/wings.png";

const EmailCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state?.name || "기본값";
  const [email, setEmail] = useState("");

  // 폰트 로드 및 이메일 fetch
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Modak&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // 이메일 불러오기
    const fetchEmail = async () => {
      try {
        const response = await axios.get("https://callme.mirim-it-show.site/email/getEmail");
        setEmail(response.data.email);
      } catch (error) {
        console.error("이메일 불러오기 실패:", error);
        setEmail("이메일을 불러올 수 없습니다.");
      }
    };

    fetchEmail();
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
          <div className="mainMessage">
            당신의 이메일이 <br /> {email} <br /> 맞습니까?
          </div>
        </div>
        <div className="buttonContainer">
          <button
            className="yesButton"
            onClick={() => navigate("/email", { state: { name } })}
          >
            아니오
          </button>
          <button
            className="noButton"
            onClick={() => navigate("/frame", { state: { name, email } })}
          >
            예
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailCheck;

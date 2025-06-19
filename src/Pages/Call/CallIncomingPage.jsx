import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PhoneLayout from "../../components/Phone";
import startButtonImage from "../../assets/images/button-yes.png";
import backButtonImage from "../../assets/images/button-no.png";
import defaultPhoneImage from "../../assets/images/phone.png";
import "bootstrap-icons/font/bootstrap-icons.css";

const BASE_URL = "https://callme.mirim-it-show.site/";

function CallIncomingPage() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [idol, setIdol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // ✅ 이름 → ID → intro 데이터 요청
  useEffect(() => {
    const fetchIdol = async () => {
      try {
        // 1. 전체 아이돌 리스트 불러오기
        const listRes = await axios.get(`${BASE_URL}idol/all`);
        const matched = listRes.data.find((item) => item.idolName === name);
        if (!matched) {
          throw new Error("해당 이름의 아이돌을 찾을 수 없습니다.");
        }

        const id = matched.id;

        // 2. intro API 요청 (숫자 ID 사용)
        const introRes = await axios.get(`${BASE_URL}idol/intro/${id}`);
        setIdol({ ...matched, intro: introRes.data.intro });
      } catch (err) {
        console.error("아이돌 intro 요청 실패:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIdol();
  }, [name]);

  // ✅ 벨소리 재생
  useEffect(() => {
    const audio = new Audio("/images/sound/따르릉.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    window.ringingAudio = audio;

    audio.play().then(() => {
      console.log("✅ 벨소리 재생 시작");
    }).catch(e => {
      console.warn("❌ 벨소리 재생 실패:", e);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToIdolList = () => {
    navigate("/idol");
  };

  const handleStartCall = async () => {
    if (window.ringingAudio) {
      window.ringingAudio.pause();
      window.ringingAudio.currentTime = 0;
      window.ringingAudio = null;
    }

    try {
      await axios.get(`${BASE_URL}idol/click/${idol.id}`);
    } catch (err) {
      console.error("클릭 수 증가 실패:", err);
    }

    const now = new Date().toISOString();
    const storedData = JSON.parse(localStorage.getItem("idolData")) || {};
    if (storedData[name]) {
      storedData[name].callCount = (storedData[name].callCount || 0) + 1;
      storedData[name].lastCallTime = now;
    } else {
      storedData[name] = {
        callCount: 1,
        lastCallTime: now,
      };
    }
    localStorage.setItem("idolData", JSON.stringify(storedData));

    setIsTransitioning(true);
    setTimeout(() => {
      navigate(`/call/incall/${name}`, { state: { name, id: idol.id } });
    }, 600);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error || !idol) return <div>해당 아이돌 데이터를 불러오지 못했습니다. 이름: {name}</div>;

  return (
    <div className={`transition-wrapper ${isTransitioning ? "zoom-out" : ""}`} style={{ cursor: "pointer" }}>
      <div
        style={{ position: "absolute", top: "90px", left: "80px", zIndex: 10, cursor: "pointer" }}
        onClick={(e) => { e.stopPropagation(); handleGoToIdolList(); }}
      >
        <i className="bi bi-chevron-left" style={{ fontSize: "4rem", color: "#358CCA" }}></i>
      </div>

      <PhoneLayout
        message={name}
        phoneImage={defaultPhoneImage}
        phoneImageClassName="shaking-phone"
        shakeAll={true}
      >
        <div className="phone-buttons shaking-phone" onClick={(e) => e.stopPropagation()}>
          <img
            src={backButtonImage}
            alt="Go Back"
            onClick={handleGoBack}
            style={{ width: "80%", height: "80%", cursor: "pointer" }}
          />
          <img
            src={startButtonImage}
            alt="Start Call"
            onClick={handleStartCall}
            style={{ width: "80%", height: "40%", cursor: "pointer" }}
          />
        </div>
      </PhoneLayout>
    </div>
  );
}

export default CallIncomingPage;

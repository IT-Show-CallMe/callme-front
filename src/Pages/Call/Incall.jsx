// [코드 상단 import는 동일하며 생략하지 않음]
import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import IncallPhoneImage from "../../assets/images/call-phone.png";
import IncallBackgroundImage from "../../assets/images/incall-background.png";
import endCallButtonImage from "../../assets/images/call-down.png";
import SpeechBubble from "../../components/SpeechBubble";
import PhoneLayout from "../../components/Phone";

const BASE_URL = "https://callme.mirim-it-show.site/";

const Incall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userCameraRef = useRef(null);

  const name = location.state?.name || "기본값";

  const [idolId, setIdolId] = useState(null);
  const [idolInfo, setIdolInfo] = useState(null);
  const [choices, setChoices] = useState([]);
  const [currentVideo, setCurrentVideo] = useState("");
  const [videoKey, setVideoKey] = useState(0);
  const [hasIntroEnded, setHasIntroEnded] = useState(false);
  const [showWaitingScreen, setShowWaitingScreen] = useState(true);
  const [bubbleVisible, setBubbleVisible] = useState(false);

  useEffect(() => {
    const fetchIdolList = async () => {
      try {
        const res = await axios.get(`${BASE_URL}idol/all`);
        const matched = res.data.find((item) => item.idolName === name);
        if (matched) {
          setIdolId(matched.id);
          setIdolInfo(matched);
        } else {
          console.warn("아이돌 이름과 일치하는 항목을 찾을 수 없습니다:", name);
        }
      } catch (err) {
        console.error("아이돌 리스트 로드 실패:", err);
      }
    };
    fetchIdolList();
  }, [name]);

  useEffect(() => {
    const fetchIntroVideo = async () => {
      if (!idolId) return;
      try {
        const response = await axios.get(`${BASE_URL}idol/intro/${idolId}`);
        const introUrl = response.data.intro.startsWith("http")
          ? response.data.intro
          : BASE_URL + response.data.intro;
        setCurrentVideo(introUrl);
      } catch (err) {
        console.error("인트로 영상 로딩 실패:", err);
      }
    };
    fetchIntroVideo();
  }, [idolId]);

  useEffect(() => {
    const fetchChoices = async () => {
      if (!idolId) return;
      try {
        const res = await axios.get(`${BASE_URL}idolVideo/choices/${idolId}`);
        setChoices(res.data || []);
      } catch (err) {
        console.error("말풍선 선택지 로딩 실패:", err);
      }
    };
    fetchChoices();
  }, [idolId]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (userCameraRef.current) {
          userCameraRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("카메라 접근 실패:", err));

    const timeoutId = setTimeout(() => setShowWaitingScreen(false), 5000);
    return () => clearTimeout(timeoutId);
  }, []);

  const endVideoRaw = idolInfo?.endVideo || "";
  const endVideo = endVideoRaw.startsWith("http")
    ? endVideoRaw
    : BASE_URL + endVideoRaw;

  const handleVideoEnded = () => {
    const isIntro = currentVideo === (idolInfo?.intro || currentVideo);
    const isEnd = currentVideo === endVideo;
    const isOutroFile = currentVideo.includes("아웃트로.mp4");

    console.log("📽 영상 종료됨:", currentVideo);

    if (!hasIntroEnded && isIntro) {
      setHasIntroEnded(true);
      setBubbleVisible(true);
    } else if (isEnd || isOutroFile) {
      navigate("/call/ended", { state: { name } });
    }
  };

  const handleOptionSelect = async (selectedChoiceText) => {
    const selectedChoice = choices.find((c) => c.choices === selectedChoiceText);

    if (selectedChoice) {
      try {
        const res = await axios.get(`${BASE_URL}idolVideo/video/${selectedChoice.id}`);
        const videoUrlRaw = res.data.videos;
        const videoUrl = videoUrlRaw.startsWith("http") ? videoUrlRaw : BASE_URL + videoUrlRaw;
        setCurrentVideo(videoUrl);
        setVideoKey((prev) => prev + 1);
      } catch (err) {
        console.error("선택지 영상 로딩 실패:", err);
      }
    } else if (selectedChoiceText === "잘 가" || selectedChoiceText === `잘 가 ${name}`) {
      if (endVideo) {
        setCurrentVideo(endVideo);
        setVideoKey((prev) => prev + 1);
      }
    }
  };

  const speechOptions = choices
    .map((c) => c.choices)
    .filter((msg) => msg && msg.trim() !== "");

  const speechBubbleStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: bubbleVisible
      ? "translate(-80%, -50%)"
      : "translate(-150%, -50%)",
    transition: "transform 0.8s ease-in-out",
    zIndex: 1,
  };

  const dualPhoneContainerStyle = {
    display: "flex",
    gap: "20px",
    transition: "transform 1s ease-in-out",
    transform: hasIntroEnded
      ? "translate(-70%, -90%)"
      : "translate(-50%, -90%)",
    position: "absolute",
    top: "50%",
    left: "50%",
  };

  const handleEndCall = () => {
    navigate("/call/ended", { state: { name } });
  };

  if (!idolInfo) {
    return (
      <div style={{ textAlign: "center", marginTop: 100, fontSize: 20, color: "gray" }}>
        아이돌 정보를 불러오는 중입니다...
      </div>
    );
  }



  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 50 }}>
      <PhoneLayout
        hideWings
        hidePhoneImage
        backgroundImage={IncallBackgroundImage}
        className="incall-page"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 50,
          paddingTop: 100,
          width: "100vw",
          maxWidth: "150%",
        }}
      >
        <div className="dual-phone-container" style={dualPhoneContainerStyle}>
          {[1, 2].map((_, idx) => (
            <div className="single-phone" key={idx} style={{ position: "relative" }}>
              <img src={IncallPhoneImage} alt="Phone" className="dual-phone-image" />

              {idx === 0 && showWaitingScreen && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontSize: 18, color: "white", fontWeight: "bold" }}>
                    영상 통화를 준비 중입니다. 잠시만 기다려 주세요...
                  </p>
                  <button
                    onClick={() => setShowWaitingScreen(false)}
                    style={{
                      marginTop: 20,
                      padding: "10px 20px",
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                  >
                    대기 종료
                  </button>
                </div>
              )}

              {idx === 0 && currentVideo && (
                <video
                key={videoKey}
                src={currentVideo}
                autoPlay
                playsInline
                preload="auto"
                onEnded={handleVideoEnded}
                onPlay={(e) => {
                  console.log("▶️ 현재 재생 중인 영상:", currentVideo);
                  
                  // 🔊 이한님 영상일 경우 소리 키움
                  if (currentVideo.includes("이한")) {
                    e.target.volume = 1; // 최대 볼륨 (0.0 ~ 1.0 사이)
                  } else {
                    e.target.volume = 0.5; // 다른 영상은 기본 볼륨
                  }
                }}
                onError={(e) => console.error("Video playback error:", e)}
                className="self-camera"
              />
              )}

              {idx === 1 && (
                <video
                  ref={userCameraRef}
                  autoPlay
                  playsInline
                  muted
                  preload="auto"
                  className="self-camera"
                  style={{ transform: "scaleX(-1)" }}
                />
              )}

              <img
                src={endCallButtonImage}
                alt="End Call"
                className="end-call-button"
                onClick={handleEndCall}
              />
            </div>
          ))}
        </div>
      </PhoneLayout>

      {hasIntroEnded && speechOptions.length > 0 && (
        <div style={speechBubbleStyle}>
          <SpeechBubble options={speechOptions} onSelect={handleOptionSelect} />
        </div>
      )}

      <div
        style={{
          position: "fixed",
          fontFamily: "Pretendard",
          fontWeight: 300,
          bottom: 90,
          left: "50%",
          transform: "translateX(-50%)",
          color: "#BDBDBD",
          padding: "10px 20px",
          borderRadius: "20px",
          fontSize: 20,
          zIndex: 1000,
        }}
      >
        빨간 버튼을 누르시면 자동으로 끊어집니다.
      </div>
    </div>
  );
};

export default Incall;

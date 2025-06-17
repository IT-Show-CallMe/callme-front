import "../styles/landing.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const imagesFiles = [
  "images/mark_bg.png", "images/mjh_bg.png", "images/sw_bg.png",
  "images/sh_bg.png", "images/so_bg.png", "images/yj_bg.png",
  "images/wy_bg.png", "images/ys_bg.png", "images/yuj_bg.png",
  "images/lh_bg.png", "images/jh_bg.png", "images/krn_bg.png",
  "images/hn_bg.png", "images/mj_bg.png"
];

function Landing() {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [audioStarted, setAudioStarted] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const audio = new Audio('/images/sound/callme.mp3');
    audio.loop = true;
    audio.volume = 1.0;
    audioRef.current = audio;

    // 자동 재생 시도 (대부분 브라우저에서 차단됨)
    audio.play()
      .then(() => {
        console.log('✅ 벨소리 자동 재생 성공');
        setAudioStarted(true);
      })
      .catch(e => {
        console.warn('❌ 벨소리 자동 재생 실패:', e);
      });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleClick = () => {
    if (audioRef.current && !audioStarted) {
      audioRef.current.play()
        .then(() => {
          setAudioStarted(true);
          console.log('✅ 클릭 후 벨소리 재생 시작');
        })
        .catch(e => {
          console.warn('❌ 클릭 후 벨소리 재생 실패:', e);
        });
    }

    setClickCount(prev => prev + 1);

    if (clickCount + 1 >= 2) {
      navigate("/main");
    }
  };

  return (
    <div className="Home-container" onClick={handleClick}>
      <img src="images/back_short.png" alt="배경이미지" className="background-img" />
      <img src="images/home_imgback.png" alt="home background" className="idol-back" />
      <img src="images/logo-img.png" className="Landing-text" />

      <div className="image-grid">
        {imagesFiles.map((file, i) => {
          const name = file.split("/")[1].split("_")[0];
          return (
            <img
              key={i}
              src={file}
              alt={name}
              className={`idol-img ${name}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          );
        })}
      </div>

      <div className="next-Page">
        <p>두 번 클릭하시면 다음 페이지로 넘어갑니다.</p>
      </div>
    </div>
  );
}

export default Landing;

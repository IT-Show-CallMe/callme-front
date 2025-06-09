import "../styles/landing.css";
import { useNavigate } from "react-router-dom";
// 앱을 시작하는 첫 화면, 클릭시 닉네임 입력처ㅏㅇ으로 넘어감감
// Landing.jsx 파일이 다음과 같이 export 되어 있는지 확인
// 이미지 리스트
const imagesFiles = [
    "images/mark_bg.png", "images/mjh_bg.png", "images/sw_bg.png",
    "images/sh_bg.png", "images/so_bg.png", "images/yj_bg.png",
    "images/wy_bg.png", "images/ys_bg.png", "images/yuj_bg.png",
    "images/lh_bg.png", "images/jh_bg.png", "images/krn_bg.png",
    "images/hn_bg.png", "images/mj_bg.png"
  ];

function Landing(){
  const navigate = useNavigate(); // 페이지 이동 함수

  const handleClick = () => {
    navigate("/main"); // 다음 페이지로 이동
  };
    return (
    <div className="Home-container" onClick={handleClick}>
        <img src="images/back_short.png" alt="배경이미지" className="background-img" />
        <img src="images/home_imgback.png" alt="home background" className="idol-back"/>
        <img src="images/landing-logo.png" className="Landing-text"/>
      
      <div className="image-grid">
        {imagesFiles.map((file, i) => {
          const name = file.split("/")[1].split("_")[0]; // ex: mark
          return (
            <img 
              key={i}
              src={file}
              alt={name}
              className={`idol-img ${name}`} // ex: class="idol-img mark"
            />
          );
        })}
      </div>
      <div className="next-Page">
        <p>클릭하시면 다음페이지로 넘어갑니다.</p>
      </div>
    </div>
  );
};

export default Landing;

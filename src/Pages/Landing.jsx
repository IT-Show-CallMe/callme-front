import "../styles/landing.css";
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
    return (
    <div className="Home-container">
        <img src="images/back_short.png" alt="배경이미지" className="background-img" />
        <img src="images/home_imgback.png" alt="home background" className="idol-back"/>


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
    </div>
  );
};

export default Landing;

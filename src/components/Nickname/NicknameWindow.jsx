import AngyeongMandoo from "./AngyeongMandoo";
import NicknameInput from "./NicknameInput";

const NicknameWindow = () => {
  return (
    <div className="window">
      <img src="images/window-img.png" alt="창 이미지" className="window-img" />
      <NicknameInput />
      <AngyeongMandoo />
    </div>
  );
};

export default NicknameWindow;

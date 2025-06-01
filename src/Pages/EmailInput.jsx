import "../styles/emailInput.css";
import BackgroundImage from "../components/Nickname/BackgroundImage";
import AngyeongMandoo from "../components/Nickname/AngyeongMandoo";
import WindowFrame from "../components/Nickname/WindowFrame";

function EmailInput() {
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
          />
          <button className="confirm-button">
            확인
          </button>
        </div>
        <AngyeongMandoo/>
      </div>
    </div>
  );
}
export default EmailInput;

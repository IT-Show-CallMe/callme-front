import { useState } from "react";
import axios from "axios";

import "../styles/emailInput.css";
import BackgroundImage from "../components/Nickname/BackgroundImage";
import AngyeongMandoo from "../components/Nickname/AngyeongMandoo";
import WindowFrame from "../components/Nickname/WindowFrame";

function EmailInput() {
  const [email, setEmail] = useState("");

  // 입력값 상태 업데이트 함수
  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  // 버튼 클릭 시 서버에 이메일 전송
  const handleSubmit = async () => {
    if (!email) {
      alert("이메일을 입력해주세요!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/users", { email });
      alert(response.data);
    } catch (error) {
      console.error("이메일 저장 실패: ", error);
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
          <button
            className="confirm-button"
            onClick={handleSubmit}
          >
            확인
          </button>
        </div>
        <AngyeongMandoo />
      </div>
    </div>
  );
}

export default EmailInput;

import { useState } from "react";
import axios from "axios";

const NicknameInput = () => {
  const [nickname, setNickname] = useState("");

  const handleInputChange = (e) => {
    setNickname(e.target.value);
  };

  const handleSubmit = async () => {
    if (!nickname) {
      alert("닉네임을 입력해주세요!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/users", {
        nickname,
      });
      alert(response.data);
    } catch (error) {
      console.error("이메일 저장 실패: ", error);
      alert("닉네임 저장 중 오류가 발생하였습니다. 다시 시도하세요.");
    }
  };

}
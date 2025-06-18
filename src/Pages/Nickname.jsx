import { useState } from "react";
import axios from "axios";
import "../styles/nickname.css";

//  앱을 시작하는 첫 화면, 사
// Nickname.jsx
const Nickname = () => {
    const [nickname, setNickname] = useState("");

    const handleInputChange = (e) => {
        setNickname(e.target.value);
    };
    
    const handleSubmit = async () =>{
        if(!nickname){
            alert("닉네임을 입력해주세요!");
            return;
        }
        try{
            const response = await axios.post("http://15.165.15.236:3000/users",{
                nickname,
            });
            alert(response.data);
        } catch(error){
            console.error("닉네임 저장 실패: ", error);
            alert("닉네임 저장 중 오류가 발생하였습니다. 다시 시도하세요.");
        }
    }
    return (
        <div className="container">
            <img src="/images/back_short.png" alt="배경 이미지" className="background-img"/>
            <div className="window">
                <img src="/images/window-img.png" alt="창 이미지" className="window-img"/>
                <div className="window-content">
                    <p className="input-title">닉네임을 입력하세요.</p>
                    <input type="text" placeholder="닉네임을 입력하세요." 
                        className="input-nickname" 
                        value={nickname} 
                        onChange={handleInputChange}
                    />  
                    <button className="confirm-button" onClick={handleSubmit}>확인</button> 
                        
                </div>
                <img src="/images/angyeongmando-img.png" alt="안경만두" className="angyeongmando-img" />
            </div>
        </div>
        
    );
};

export default Nickname;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneLayout from '../../components/Phone';
import startButtonImage from '../../assets/images/button-yes.png';  // 영상통화 시작 버튼 이미지
import backButtonImage from '../../assets/images/button-no.png';  // 뒤로 가는 버튼 이미지

function CallIncomingPage() {
    const navigate = useNavigate();  // navigate 훅 초기화
  
    // 영상 통화 시작 시 호출되는 함수
    const handleStartCall = () => {
      navigate('/call/incall');  // 영상 통화 시작 후 이동할 경로
    };
  
    // 뒤로 가기 버튼 클릭 시 호출되는 함수
    const handleGoBack = () => {
      navigate(-1);  // 전 페이지로 돌아가기
    };
  
    return (
        <PhoneLayout message="소희(임시)">
          <div className="phone-buttons">
            {/* 뒤로 가기 이미지 클릭 시 전 페이지로 돌아가기 */}
            <img
              src={backButtonImage}
              alt="Go Back"
              onClick={handleGoBack}
            />
            
            {/* 영상 통화 시작 이미지 클릭 시 /call/started 경로로 이동 */}
            <img
              src={startButtonImage}
              alt="Start Call"
              onClick={handleStartCall}
            />
          </div>
        </PhoneLayout>
      );
    }
    
    export default CallIncomingPage;
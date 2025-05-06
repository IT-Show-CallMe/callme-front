import React from 'react';
import PhoneLayout from '../../components/Phone';
import "../../styles/incall.css"; 
function Incall() {
  return (
    <PhoneLayout message="소희(임시)">
      <div style={{ textAlign: 'center', color: 'white' }}>
        <p>📞 영상통화 연결 중...</p>
        {/* 나중에 버튼이나 상태 추가하면 여기 넣기 */}
      </div>
    </PhoneLayout>
  );
}

export default Incall;
// 샘플 코드
export const sendEmail = async (to, videoFile) => {
    // 백엔드 API 호출로 이메일 보내기
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: JSON.stringify({ to, video: videoFile }),
        headers: { 'Content-Type': 'application/json' },
      });
      return await response.json();
    } catch (err) {
      console.error('이메일 전송 실패:', err);
    }
  };
  
import React from 'react';
import "../styles/incall.css";
import SpeechBubbleimg from '../assets/images/speechbubble.png'; // 배경 이미지

const SpeechBubble = ({ question, options, onSelect }) => {
  return (
    <div className="speech-bubble-container">
      {/* 이미지 배경으로 사용 */}
      <img
        src={SpeechBubbleimg}
        alt="Speech Bubble"
        className="speech-bubble-image"
      />
      
      {/* 질문 텍스트 */}
      <p className="question-text">{question}</p>
      
      {/* 옵션 버튼들 */}
      <div className="options">
        {options.map((option, idx) => (
          <button
            key={idx}
            className="speech-bubble-option"
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpeechBubble;

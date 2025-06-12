import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from "../styles/IdolModal.module.css";
import IdolCard from "./IdolCard";
import { useNavigate } from "react-router-dom";

export default function IdolModal({ imgUrl, group, name, count, onClose }) {
  const navigate = useNavigate();

  const handleCall = async () => {
    // if (!window.ringingAudio) {
    //   const audio = new Audio('/images/sound/따르릉.mp3');
    //   audio.loop = true;
    //   audio.volume = 1.0;
    //   window.ringingAudio = audio;
    //   try {
    //     await audio.play();
    //     console.log("✅ 벨소리 재생 시작");
    //   } catch (e) {
    //     console.warn("❌ 벨소리 재생 실패:", e);
    //   }
    // }
    navigate(`/call/incoming/${name}`, { state: { name } });
  };

  return (
    <div className={styles.modalContainer} onClick={onClose}>
      <div className={styles.contentBox} onClick={e => e.stopPropagation()}>
        <IdolCard
          imgUrl={imgUrl}
          group={group}
          name={name}
          count={count}
          onCall={handleCall}
        />
      </div>
    </div>
  );
}

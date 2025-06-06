import { useState, useEffect } from "react";
import styles from "../styles/IdolDetail.module.css";
import idolData from "../data/idolJson.json";
import SearchBar from "../components/SearchBar";
import IdolModal from "../components/IdolModal";
import { createPortal } from "react-dom";

const ModalPortal = function (props) {
  const modalArea = document.getElementById('modal');
  return createPortal(props.children, modalArea);
};

export default function IdolDetail() {
  const [idols, setIdols] = useState(idolData);
  const [selectedIdol, setSelectedIdol] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [callData, setCallData] = useState({}); // MainPage와 동일한 방식으로 관리

  useEffect(() => {
    // MainPage와 동일한 방식으로 localStorage에서 데이터 가져오기
    const stored = JSON.parse(localStorage.getItem('idolData')) || {};
    setCallData(stored);
  }, []);

  const handleClick = (name) => {
    const currentCount = callData[name]?.callCount || 0;

    const selectedIdolData = {
      ...idols[name],
      callCount: currentCount,
    };

    setSelectedIdol(selectedIdolData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIdol(null);
  };

  const filteredIdols = Object.entries(idols).filter(([name, data]) => {
    const search = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(search) ||
      data.idolName.toLowerCase().includes(search) ||
      data.idolGroup.toLowerCase().includes(search) ||
      (data.idolGroupKor && data.idolGroupKor.includes(searchTerm))
    );
  });

  return (
    <div className={styles.idolDetailContainer}>
      <img src="images/back_short.png" alt="배경이미지" className="background-img" />

      <h1 className={styles.title}> pick your Idol </h1>

      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="원하는 아이돌의 이름을 입력하세요."
      />

      <div className={styles.container}>
        {filteredIdols.map(([name, data]) => {
          // callData에서 해당 아이돌의 count 가져오기 (MainPage와 동일한 방식)
          const currentCount = callData[name]?.callCount || 0;

          return (
            <div
              key={name}
              className={styles.card}
              onClick={() => handleClick(name)}
            >
              <img
                src={data.idolImg}
                alt={data.idolName}
                className={styles.idolImg}
              />
              {/* count 표시가 필요하다면 여기에 추가 */}
              {/* <div className={styles.callCount}>{currentCount}</div> */}
            </div>
          );
        })}
      </div>

      {isModalOpen && selectedIdol && (
        <ModalPortal>
          <IdolModal
            imgUrl={selectedIdol.idolImg}
            group={selectedIdol.idolGroup}
            name={selectedIdol.idolName}
            count={selectedIdol.callCount}
            onClose={handleCloseModal}
          />
        </ModalPortal>
      )}
    </div>
  );
}
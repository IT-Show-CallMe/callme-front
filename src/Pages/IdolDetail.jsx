import { useState } from "react";
import styles from "../styles/IdolDetail.module.css";
import idolData from "../data/idolJson.json";
import SearchBar from "../components/SearchBar";
import IdolModal from "../components/IdolModal";

import { createPortal } from "react-dom";

const ModalPortal = function(props) {
    const modalArea = document.getElementById('modal')
    return createPortal(props.children, modalArea)
}

export default function IdolDetail() {
  const [idols, setIdols] = useState(idolData);

  const [selectedIdol, setSelectedIdol] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (name) => {
    const updatedIdol = {
      ...idols[name],
      idolCount: idols[name].idolCount + 1,
    };

    setIdols((prev) => ({
      ...prev,
      [name]: updatedIdol,
    }));

    setSelectedIdol(updatedIdol); // ✅ 이 값은 이미 업데이트된 상태
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIdol(null);
  };


  return (
    <div className={styles.idolDetailContainer}>
      <img src="images/back_short.png" alt="배경이미지" className="background-img" />

      <h1 className={styles.title}> pick your Idol </h1>

      <SearchBar />

      <div className={styles.container}>

        {Object.entries(idols)
          .sort(([a], [b]) => a.localeCompare(b, "ko"))
          .map(([name, data]) => (
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
              {/* <div className={styles.idolName}>{data.idolName}</div>
              <div className={styles.idolGroup}>{data.idolGroup}</div>
              <div className={styles.idolIndex}>index: {data.idolIndex}</div>
              <div className={styles.idolCount}>❤️ {data.idolCount}</div> */}
            </div>
          ))}
      </div>
      {isModalOpen && selectedIdol && (
        <ModalPortal>
          <IdolModal
            imgUrl={selectedIdol.idolImg}
            group={selectedIdol.idolGroup}
            name={selectedIdol.idolName}
            count={selectedIdol.idolCount}
            onClose={handleCloseModal}
          />
        </ModalPortal>
      )}
    </div>
  );
}

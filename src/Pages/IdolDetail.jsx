import { useState } from "react";
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

  const handleClick = (name) => {
    const updatedIdol = {
      ...idols[name],
      idolCount: idols[name].idolCount + 1,
    };

    setIdols((prev) => ({
      ...prev,
      [name]: updatedIdol,
    }));

    setSelectedIdol(updatedIdol);
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
        {filteredIdols.map(([name, data]) => (
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

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

  useEffect(() => {
    const updatedIdols = { ...idolData };
    Object.keys(updatedIdols).forEach((name) => {
      const storedCount = localStorage.getItem(`callCount_${name}`);
      if (storedCount !== null) {
        updatedIdols[name].callCount = Number(storedCount);
      } else {
        updatedIdols[name].callCount = 0;
      }
    });
    setIdols(updatedIdols);
  }, []);

  const handleClick = (name) => {
    const prevCount = idols[name].callCount || 0;
    const updatedIdol = {
      ...idols[name],
      callCount: prevCount + 1,
    };

    localStorage.setItem(`callCount_${name}`, updatedIdol.callCount);
    localStorage.setItem("lastCalledIdolName", updatedIdol.idolName);
    localStorage.setItem("lastCalledIdolId", updatedIdol.id);

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
            count={selectedIdol.callCount}
            onClose={handleCloseModal}
          />
        </ModalPortal>
      )}
    </div>
  );
}
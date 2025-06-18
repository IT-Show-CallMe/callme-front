import { useState, useEffect } from "react";
import styles from "../styles/IdolDetail.module.css";
import SearchBar from "../components/SearchBar";
import IdolModal from "../components/IdolModal";
import { createPortal } from "react-dom";

const ModalPortal = function (props) {
  const modalArea = document.getElementById("modal");
  return createPortal(props.children, modalArea);
};

export default function IdolDetail() {
  const [selectedIdol, setSelectedIdol] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [idols, setIdols] = useState([]);

  const baseUrl = "https://callme.mirim-it-show.site/"; // MainPage와 동일한 베이스 URL

  // 서버에서 모든 아이돌 데이터 가져오기 (MainPage와 유사한 방식)
  useEffect(() => {
    const fetchAllIdols = async () => {
      try {
        const res = await fetch("https://callme.mirim-it-show.site/idol/all");
        const data = await res.json();

        // 데이터 가공 (MainPage의 fetchTop5Idols와 유사한 구조)
        const formatted = data.map(idol => ({
          id: idol.id,
          name: idol.idolName,
          idolGroup: idol.idolGroup,
          idolGroupKor: idol.idolGroupKor,
          idolImg: `${baseUrl}${idol.idolImages}`,
          count: idol.videoCallCount || 0, // 서버에서 받아온 클릭 횟수
          originalData: idol // 원본 데이터 보관
        }));

        setIdols(formatted);
      } catch (err) {
        console.error("아이돌 데이터 로딩 실패:", err);
        setIdols([]);
      }
    };

    fetchAllIdols();
  }, []);

  const handleClick = async (idolData) => {
    try {
      // localStorage 저장 (MainPage의 handleCallStart와 동일)
      localStorage.setItem("lastCalledIdolName", idolData.name);
      localStorage.setItem("lastCalledIdolId", idolData.id);

      // 서버 요청 (클릭 카운트 증가)
      const res = await fetch(`https://callme.mirim-it-show.site/idol/click/${idolData.id}`, {
        method: "GET",
      });
      const result = await res.json();

      // 업데이트된 카운트로 모달에 표시할 데이터 설정
      const updatedCount = result.callCount || idolData.count;

      setSelectedIdol({
        ...idolData,
        count: updatedCount,
      });

      setIsModalOpen(true);
    } catch (err) {
      console.error("아이돌 클릭 실패:", err);
      // 에러가 발생해도 기존 카운트로 모달 열기
      setSelectedIdol(idolData);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIdol(null);
  };

  // 검색 필터링
  const filteredIdols = idols.filter((idol) => {
    const search = searchTerm.toLowerCase();
    return (
      idol.name.toLowerCase().includes(search) ||
      idol.idolGroup.toLowerCase().includes(search) ||
      (idol.idolGroupKor && idol.idolGroupKor.includes(search))
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
        {filteredIdols.map((idol) => (
          <div
            key={idol.id}
            className={styles.card}
            onClick={() => handleClick(idol)}
          >
            <img
              src={idol.idolImg || "images/default.png"}
              alt={idol.name}
              className={styles.idolImg}
            />
            {/* 클릭 횟수 표시가 필요하다면 주석 해제 */}
            {/* <div className={styles.callCount}>{idol.count}</div> */}
          </div>
        ))}
      </div>

      {isModalOpen && selectedIdol && (
        <ModalPortal>
          <IdolModal
            imgUrl={selectedIdol.idolImg}
            group={selectedIdol.idolGroup}
            name={selectedIdol.name}
            count={selectedIdol.count}
            onClose={handleCloseModal}
          />
        </ModalPortal>
      )}
    </div>
  );
}
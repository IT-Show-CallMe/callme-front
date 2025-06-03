import React, { useEffect, useState, useRef } from 'react';
import idolJsonData from "../data/idolJson.json";
import IdolModal from '../components/IdolModal';
import SearchBar from "../components/SearchBar";
import IdolCard from "../components/IdolCard";
import LetterComponent from '../components/LetterComponent'
import mainBackground from '../assets/images/main-background.png';
import LettersJson from '../data/lettersData.json';
import mainPageStyles from '../styles/mainPage.module.css'
import styles from "../styles/main_letter.module.css";

// const breakpointColumnsObj = {
//     default: 2, // 기본 2열
//     700: 1      // 700px 이하에서는 1열
// };


function MainPage() {
    const [keyword, setKeyword] = useState("");
    const handleChange = (e) => setKeyword(e.target.value);
    // callCount
    const [callData, setCallData] = useState({});
    const [selectedIdol, setSelectedIdol] = useState(null);
    const [top5Data, setTop5Data] = useState([]);
    const firstRow = top5Data.slice(0, 3);
    const secondRow = top5Data.slice(3, 5);
    const [activeLetterId, setActiveLetterId] = useState(null);
    const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });
    const letterSectionRef = useRef(null);
    const sentLetter = JSON.parse(localStorage.getItem('sentLetter') || '{}');

    // LettersJson.forEach(l => console.log('main data:', l.content));
    useEffect(() => {
        if (!callData) return;

        const top5 = Object.entries(callData)
            .map(([name, data]) => ({
                name,
                count: data.callCount,
                lastCall: data.lastCallTime,
                ...idolJsonData[name],
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        setTop5Data(top5);
    }, [callData]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('idolData')) || {};
        setCallData(stored);
    }, []);

    // 모달 띄우기 예시
    const openModal = (idolName) => {
        setSelectedIdol(idolName);
    };

    const closeModal = () => setSelectedIdol(null);
    console.log(idolJsonData);


    const handleLetterOpen = (id) => {
        if (letterSectionRef.current) {
            const rect = letterSectionRef.current.getBoundingClientRect();
            setCenterPos({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            });
        }
        setActiveLetterId(id);
    };
    // console.log('lettersJson:', LettersJson);


    return (
        <div className={mainPageStyles.mainPageWrapper} style={{ position: "relative" }}>
            <img src={mainBackground} alt="main background" style={{ width: '100%' }} className={mainPageStyles.mainBackground} />
            <div className={mainPageStyles.contentWrapper}>
                <section className={mainPageStyles.Header}>
                    <h1 className={mainPageStyles.title}>Welcome to CallMe!</h1>
                    <SearchBar
                        value={keyword}
                        onChange={handleChange}
                    />
                </section>
                <section className={mainPageStyles.top5IdolSection}>
                    <h2 className={mainPageStyles.sectionTitle}>인기 아이돌 Top 5</h2>
                    <p className={mainPageStyles.sectionSubtitle}>지금 인기 있는 아이돌의 영상통화를 확인해 보세요!</p>
                    <div className={mainPageStyles.top5Idols}>
                        <div className={mainPageStyles.row}>
                            {firstRow.map(idol => (
                                <div
                                    key={idol.name}
                                    // className={idolModalStyles.idolCard}
                                    className={mainPageStyles.idolCardFrame}
                                    onClick={() => openModal(idol.name)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <IdolCard
                                        imgUrl={idol.idolImg}
                                        group={idol.idolGroup}
                                        name={idol.name}
                                        count={idol.count}
                                        showCallButton={false}
                                        groupClassName={mainPageStyles.groupClassName}
                                        nameClassName={mainPageStyles.nameClassName}
                                        countClassName={mainPageStyles.countClassName}
                                        HeartIconName={mainPageStyles.HeartIconName}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className={mainPageStyles.row}>
                            {secondRow.map(idol => (
                                <div key={idol.name} className={mainPageStyles.idolCardFrame}
                                    onClick={() => openModal(idol.name)}
                                    style={{ cursor: 'pointer' }}>
                                    <IdolCard
                                        imgUrl={idol.idolImg}
                                        group={idol.idolGroup}
                                        name={idol.name}
                                        count={idol.count}
                                        showCallButton={false}
                                        groupClassName={mainPageStyles.groupClassName}
                                        nameClassName={mainPageStyles.nameClassName}
                                        countClassName={mainPageStyles.countClassName}
                                        HeartIconName={mainPageStyles.HeartIconName}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section className={mainPageStyles.letterSection} ref={letterSectionRef}>
                    <h2 className={mainPageStyles.sectionTitle}>Letter</h2>
                    <p className={mainPageStyles.sectionSubtitle}>영상통화를 끝낸 후 팬들이 보내는 마음들을 확인해봐요</p>
                    <div className={mainPageStyles.letters}>
                        {LettersJson.map((letter, idx) => {
                            // console.log('map data:', letter.content);
                            const isActive = activeLetterId === letter.id;
                            return (
                                <div
                                    key={letter.id}
                                    className={`${mainPageStyles.letterItem} ${idx % 2 === 0 ? mainPageStyles.left : mainPageStyles.right}`}
                                    style={{
                                        zIndex: isActive ? 999 : idx,
                                    }}
                                >
                                    <LetterComponent
                                        to={letter.to}
                                        from={letter.from}
                                        content={letter.content}
                                        isActive={isActive}
                                        onOpen={() => handleLetterOpen(letter.id)}
                                        onClose={() => setActiveLetterId(null)}
                                        centerPos={centerPos}
                                        className={styles.letterViewSmall}
                                    />


                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MainPage;
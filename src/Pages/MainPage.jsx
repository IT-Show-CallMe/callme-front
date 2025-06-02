import React, { useEffect, useState } from 'react';
import idolJsonData from "../data/idolJson.json";
import IdolModal from '../components/IdolModal';
import SearchBar from "../components/SearchBar";
import IdolCard from "../components/IdolCard";
import LetterComponent from '../components/LetterComponent'
import mainBackground from '../assets/images/main-background.png';
import LettersJson from '../data/lettersData.json';

import Masonry from 'react-masonry-css';
import mainPageStyles from '../styles/mainPage.module.css'

const breakpointColumnsObj = {
    default: 2, // 기본 2열
    700: 1      // 700px 이하에서는 1열
};


function MainPage() {
    const [keyword, setKeyword] = useState("");
    const handleChange = (e) => setKeyword(e.target.value);
    // callCount
    const [callData, setCallData] = useState({});
    const [selectedIdol, setSelectedIdol] = useState(null);
    const [top5Data, setTop5Data] = useState([]);
    const firstRow = top5Data.slice(0, 3);
    const secondRow = top5Data.slice(3, 5);
    // const [letters, setLetters] = useState(initialLetters);


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
    console.log(idolJsonData); // ✅ 이거 먼저 확인!
    // function IdolCard({ idol }) {
    //     // ...
    // }

    // function LetterEnvelope({ letter }) {
    //     // ...
    // }

    // function LetterModal({ letter, onClose }) {
    //     // ...
    // }


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
                <section className={mainPageStyles.letterSection}>
                    <h2 className={mainPageStyles.sectionTitle}>Letter</h2>
                    <p className={mainPageStyles.sectionSubtitle}>지금 인기 있는 아이돌의 영상통화를 확인해 보세요!</p>
                    <div className={mainPageStyles.letters}>
                        {LettersJson.map((letter, idx) => (
                            <div
                                key={letter.id}
                                className={`${mainPageStyles.letterItem} ${idx % 2 === 0 ? mainPageStyles.left : mainPageStyles.right}`}
                                style={{
                                    transform: `translateY(${idx % 2 === 1 ? '-50px' : '0'})`, 
                                    zIndex: idx, // 겹칠 때 위로 올라오게
                                }}
                            >
                                <LetterComponent
                                    to={LettersJson.to}
                                    from={LettersJson.from}
                                    content={LettersJson.content}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MainPage;
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import IdolModal from "../components/IdolModal";
import SearchBar from "../components/SearchBar";
import IdolCard from "../components/IdolCard";
import LetterComponent from "../components/LetterComponent";
import CaptureTimeImgSection from "../components/CaptureTimeView";
// 임의의 json
import idolJsonData from "../data/idolJson.json";
// import LettersJson from "../data/lettersData.json"; // 제거
// style
import mainPageStyles from "../styles/mainPage.module.css";
import styles from "../styles/main_letter.module.css";
import mainBackground from "../assets/images/main-background.png";

import leftWingImage from "../assets/images/wing-left.png";
import rightWingImage from "../assets/images/wing-right.png";
import animationLetterImage from "../assets/images/animationLetter.png";

function MainPage() {
    const [keyword, setKeyword] = useState("");
    const handleChange = (e) => setKeyword(e.target.value);
    // callCount
    const [callData, setCallData] = useState({});
    const [selectedIdol, setSelectedIdol] = useState(null);
    const [top5Data, setTop5Data] = useState([]);
    const [firstRow, setFirstRow] = useState([]);   // 첫 3명 아이돌 리스트
    const [secondRow, setSecondRow] = useState([]);
    const [activeLetterId, setActiveLetterId] = useState(null);
    const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });
    const letterSectionRef = useRef(null);
    const sentLetter = JSON.parse(localStorage.getItem('sentLetter') || '{}');
    const navigate = useNavigate();
    const sectionRefs = [useRef(null), useRef(null), useRef(null)];
    const [currentIdolName, setCurrentIdolName] = useState("");

    // 편지 관련 상태 추가
    const [letters, setLetters] = useState([]);
    const [activeLetterDetail, setActiveLetterDetail] = useState(null);
    const [isLoadingLetters, setIsLoadingLetters] = useState(false);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    // 편지 도착 애니메이션 상태
    const [showLetterArrival, setShowLetterArrival] = useState(false);
    const [newLetterData, setNewLetterData] = useState(null);

    // 바뀐 부분 : 새로운 편지 알림 관련 상태 추가
    // 되야하는 동작 : 새로운 편지가 도착했을 때 첫 번째 편지에 깜빡이는 숫자 표시와 내용 슬라이딩 텍스트 보여주기
    const [showNewLetterIndicator, setShowNewLetterIndicator] = useState(false);
    const [newLetterContent, setNewLetterContent] = useState('');


    const baseUrl = 'https://callme.mirim-it-show.site'; // 개발 중인 서버 주소
    // const imageUrl = `${baseUrl}/${idol.idolImages}`; // idolImages에는 'uploads/idol_img/p_김선우.png' 같은 문자열

    // 새 편지 도착 확인 (localStorage에서 sentLetter 확인)

    useEffect(() => {
        const checkNewLetter = () => {
            const sentLetterData = JSON.parse(localStorage.getItem('sentLetter') || '{}');
            if (sentLetterData && Object.keys(sentLetterData).length > 0) {
                setNewLetterData(sentLetterData);
                setShowLetterArrival(true);

                // 바뀐 부분 : 새로운 편지 내용 저장
                // 되야하는 동작 : 편지 내용을 상태에 저장하여 슬라이딩 텍스트로 표시
                setNewLetterContent(sentLetterData.message || '새로운 편지가 도착했습니다!');

                // 단계별 스크롤 애니메이션
                const scrollToLetterSection = () => {
                    const startPosition = window.pageYOffset;
                    const targetElement = letterSectionRef.current;

                    if (!targetElement) return;

                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 100; // 100px 여유
                    const distance = targetPosition - startPosition;
                    const duration = 2000; // 2초 동안 스크롤
                    let start = null;

                    const step = (timestamp) => {
                        if (!start) start = timestamp;
                        const progress = timestamp - start;
                        const progressPercentage = Math.min(progress / duration, 1);

                        // easeInOutCubic 이징 함수 적용
                        const easedProgress = progressPercentage < 0.5
                            ? 4 * progressPercentage * progressPercentage * progressPercentage
                            : 1 - Math.pow(-2 * progressPercentage + 2, 3) / 2;

                        window.scrollTo(0, startPosition + distance * easedProgress);

                        if (progress < duration) {
                            requestAnimationFrame(step);
                        }
                    };

                    requestAnimationFrame(step);
                };

                // 편지가 날아오기 시작하고 1.5초 후 스크롤 시작
                setTimeout(scrollToLetterSection, 1500);

                // 4초 후 애니메이션 종료
                setTimeout(() => {
                    setShowLetterArrival(false);
                    fetchAllLetters();
                    localStorage.removeItem('sentLetter');

                    // 바뀐 부분 : 편지 도착 후 새로운 편지 표시 활성화
                    // 되야하는 동작 : 편지 도착 애니메이션이 끝나면 새로운 편지 표시를 활성화
                    setShowNewLetterIndicator(true);

                    // 바뀐 부분 : 10초 후 새로운 편지 표시 제거
                    // 되야하는 동작 : 10초 후 자동으로 새로운 편지 표시를 숨김
                    setTimeout(() => {
                        setShowNewLetterIndicator(false);
                    }, 100000);
                }, 4000);
            }
        };

        checkNewLetter();
        const interval = setInterval(checkNewLetter, 1000);
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const fetchTop5Idols = async () => {
            try {
                const res = await fetch("https://callme.mirim-it-show.site/idol/top5Idol"); // 포트 주의
                const data = await res.json();

                // 데이터 가공
                const formatted = data.map(idol => ({
                    id: idol.id,
                    name: idol.idolName,
                    idolGroup: idol.idolGroupKor,
                    idolImg: `${baseUrl}/${idol.idolImages}`,
                    count: idol.videoCallCount
                }));

                setFirstRow(formatted.slice(0, 3));
                setSecondRow(formatted.slice(3, 5));
            } catch (err) {
                console.error("Top 5 아이돌 로딩 실패:", err);
            }
        };

        fetchTop5Idols();
    }, []);

    useEffect(() => {
        let countdown = 60; // 60초
        const intervalId = setInterval(() => {
            countdown -= 1;

            console.clear(); // 콘솔 지우기
            console.log(`⏳ 랜딩페이지 자동 이동까지 남은 시간: ${countdown}초`);

            if (countdown <= 0) {
                clearInterval(intervalId);
                navigate('/'); // 랜딩페이지로 이동
            }
        }, 1000); // 1초마다 실행

        return () => clearInterval(intervalId);
    }, [navigate]);

    // IdolCard 
    const [hoveredIdolId, setHoveredIdolId] = useState(null);
    const handleCallStart = async (idolId, idolName) => {
        localStorage.setItem("lastCalledIdolId", idolId);
        localStorage.setItem("lastCalledIdolName", idolName);
        try {
            // 1. 서버에 통화 요청 전송
            await fetch(`https://callme.mirim-it-show.site/idol/click/${idolId}`, {
                method: "GET",
                // headers: {
                //     "Content-Type": "application/json"
                // },
                // body: JSON.stringify({ idolName })
            });
            setCurrentIdolName(idolName);

            navigate(`/call/incoming/${encodeURIComponent(idolName)}`);
        } catch (error) {
            console.error("통화 시작 중 에러 발생:", error);
        }
    };

    const goToIdolDetail = () => {
        navigate('/idol');
    };


    // 모든 편지 목록 가져오기
    const fetchAllLetters = async () => {
        setIsLoadingLetters(true);
        try {
            const response = await fetch('https://callme.mirim-it-show.site/letter/allLetter');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('편지 목록:', data);
            setLetters(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('편지 목록 가져오기 오류:', error);
            setLetters([]);
        } finally {
            setIsLoadingLetters(false);
        }
    };

    // 특정 편지 상세 내용 가져오기
    const fetchMessageDetail = async (messageId) => {
        setIsLoadingDetail(true);
        try {
            const response = await fetch(`https://callme.mirim-it-show.site/letter/message/${messageId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('편지 상세:', data);
            setActiveLetterDetail(data);
        } catch (error) {
            console.error('편지 상세 내용 가져오기 오류:', error);
            // 에러 시 기본값 설정
            setActiveLetterDetail({
                idolName: '아이돌',
                nickname: '익명',
                message: '편지 내용을 불러올 수 없습니다.'
            });
        } finally {
            setIsLoadingDetail(false);
        }
    };

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

    // 컴포넌트 마운트 시 편지 목록 가져오기
    useEffect(() => {
        fetchAllLetters();
    }, []);

    // 모달 띄우기 예시
    const openModal = (idolName) => {
        setSelectedIdol(idolName);
    };

    const closeModal = () => setSelectedIdol(null);


    const handleLetterOpen = async (letterId) => {
        if (letterSectionRef.current) {
            const rect = letterSectionRef.current.getBoundingClientRect();
            setCenterPos({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            });
        }
        setActiveLetterId(letterId);


        // 바뀐 부분 : 편지를 열 때 새로운 편지 표시 제거
        // 되야하는 동작 : 사용자가 편지를 열면 새로운 편지 표시를 숨김
        if (showNewLetterIndicator) {
            setShowNewLetterIndicator(false);
        }

        // 편지 상세 내용 가져오기
        await fetchMessageDetail(letterId);
    };

    const handleLetterClose = () => {
        setActiveLetterId(null);
        setActiveLetterDetail(null);
    };

    const handleScrollDown = () => {
        const currentScroll = window.scrollY;
        const nextSection = sectionRefs.find(ref => {
            if (!ref.current) return false;
            const top = ref.current.getBoundingClientRect().top + window.scrollY;
            return top - currentScroll > 10;
        });
        if (nextSection && nextSection.current) {
            nextSection.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const renderIdolRow = (rowData, rowKeyPrefix) => (
        <div className={mainPageStyles.row}>
            {rowData.map((idol, index) => (
                <div
                    key={idol.name}
                    className={mainPageStyles.idolCardFrame}
                    onMouseEnter={() => setHoveredIdolId(`${rowKeyPrefix}-${index}`)}
                    onMouseLeave={() => setHoveredIdolId(null)}
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
                        nameGroupWrapperClassName={mainPageStyles.nameGroupWrapperCustom}
                        hitsClassName={mainPageStyles.hitsCustom}
                    />

                    {hoveredIdolId === `${rowKeyPrefix}-${index}` && (
                        <div className={mainPageStyles.callOverlay}>
                            <button className={mainPageStyles.callButton}
                                key={idol.id}
                                onClick={() => handleCallStart(idol.id, idol.name)}>
                                <div className={mainPageStyles.callCircle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="29" viewBox="0 0 26 29" fill="none">
                                        <path d="M8.13271 18.0644C6.15284 15.3542 5.46177 13.679 4.80758 10.4056C4.50246 7.88854 4.75981 6.26336 5.60324 3.91503L5.78008 3.43508L5.80372 3.36302C6.16333 2.51937 10.1158 -1.29027 11.9405 3.26792C13.3301 6.73928 13.876 7.45529 11.8878 8.97086L10.695 9.88042L10.6834 9.97153C10.6418 10.3905 10.5948 12.2228 12.5062 14.7294C14.6775 17.5767 16.6782 17.7564 16.7024 17.7585L16.703 17.7593L17.8958 16.8497C19.8835 15.3334 20.4296 16.0494 23.4094 18.3081C27.3222 21.274 22.6023 24.0774 21.6937 24.2009L21.6179 24.2046L20.5927 24.3097C18.332 24.5115 16.9219 24.3935 14.911 23.655C12.1314 22.2746 10.6188 21.232 8.13271 18.0644Z" fill="black" />
                                    </svg>
                                </div>
                                <div className={mainPageStyles.callTextWrapper}>
                                    <div className={mainPageStyles.callMainText}>전화하러 가기</div>
                                    <div className={mainPageStyles.callSubText}>지금 바로 통화해보세요</div>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    const STAR_COUNT = 70;
    const stars = Array.from({ length: STAR_COUNT }, (_, i) => {
        const isLeft = Math.random() < 0.8;
        const left = isLeft
            ? Math.random() * 50
            : 50 + Math.random() * 30;
        const top = 80 + Math.pow(i / (STAR_COUNT - 1), 0.8) * 60;
        const delay = Math.random() * 0.8;
        const size = 4 + Math.random() * 2;
        return (
            <div
                key={i}
                className={mainPageStyles.star}
                style={{
                    top: `${top}px`,
                    left: `${left}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    animationDelay: `${delay}s`
                }}
            />
        );
    });

    return (
        <div className={mainPageStyles.mainPageWrapper} style={{ position: "relative" }}>
            <img src={mainBackground} alt="main background" style={{ width: '100%' }} className={mainPageStyles.mainBackground} />
            <div className={mainPageStyles.contentWrapper}>
                <section className={mainPageStyles.Header}>
                    <h1 className={mainPageStyles.title}>Welcome to CallMe!</h1>
                    <button className={mainPageStyles.titleButton} onClick={goToIdolDetail}>영상통화할 아이돌 검색하러 가기</button>
                </section>
                <section ref={sectionRefs[1]} className={mainPageStyles.top5IdolSection}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 className={mainPageStyles.sectionTitle}>인기 아이돌 Top 5</h2>
                            <p className={mainPageStyles.sectionSubtitle}>지금 인기 있는 아이돌의 영상통화를 확인해 보세요!</p>
                        </div>
                        <span className={mainPageStyles.moreButton} onClick={goToIdolDetail}>더보기 &gt;</span>
                    </div>
                    <div className={mainPageStyles.top5Idols}>
                        {renderIdolRow(firstRow, 'first')}
                        {renderIdolRow(secondRow, 'second')}
                    </div>
                </section>
                <section className={mainPageStyles.captureTimeSection} style={{ justifyContent: 'center' }}>
                    <h2 className={mainPageStyles.sectionTitle}>Capture Time</h2>
                    <p className={mainPageStyles.sectionSubtitle}>아이돌과 함께 찍은 사진들을 확인해봐요</p>
                    <CaptureTimeImgSection />
                </section>
                <section className={mainPageStyles.letterSection}
                    ref={el => {
                        letterSectionRef.current = el;
                        sectionRefs[2].current = el;
                    }}>
                    <h2 className={mainPageStyles.sectionTitle}>Letter</h2>
                    <p className={mainPageStyles.sectionSubtitle}>영상통화를 끝낸 후 팬들이 보내는 마음들을 확인해봐요</p>

                    {isLoadingLetters ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            편지를 불러오는 중...
                        </div>
                    ) : (
                        <div className={mainPageStyles.letters}>
                            {letters.map((letter, idx) => {
                                const isActive = activeLetterId === letter.id;
                                // 활성화된 편지의 경우 상세 데이터 사용, 아니면 기본 편지 데이터 사용
                                const letterData = isActive && activeLetterDetail ? activeLetterDetail : letter;

                                // 바뀐 부분 : 첫 번째 편지인지 확인
                                // 되야하는 동작 : 첫 번째 편지에만 새로운 편지 표시를 보여줌
                                const isFirstLetter = idx === 0;

                                return (
                                    <div
                                        key={letter.id}
                                        className={mainPageStyles.letterItem}
                                        style={{
                                            zIndex: isActive ? 999 : idx,
                                        }}
                                    >
                                        <LetterComponent
                                            letterId={letter.id}
                                            to={letterData.idolName || '아이돌'}
                                            from={letterData.nickname || '익명'}
                                            content={letterData.message || '편지를 열어보세요'}
                                            isActive={isActive}
                                            onOpen={() => handleLetterOpen(letter.id)}
                                            onClose={handleLetterClose}
                                            centerPos={centerPos}
                                            className={styles.letterViewSmall}
                                            isLoading={isActive && isLoadingDetail}
                                        />
                                        {/* 바뀐 부분 : 새로운 편지 표시 추가 */}
                                        {/* 되야하는 동작 : 첫 번째 편지에 깜빡이는 숫자 1과 슬라이딩 텍스트 표시 */}
                                        {isFirstLetter && showNewLetterIndicator && (
                                            <>
                                                {/* 깜빡이는 숫자 1 표시 */}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '31px',
                                                    left: '-21px',
                                                    width: '30px',
                                                    height: '30px',
                                                    backgroundColor: '#ff4757',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '16px',
                                                    zIndex: 1001,
                                                    // animation: 'blinkNumber 1.5s ease-in-out infinite',
                                                    boxShadow: '0 2px 10px rgba(255, 71, 87, 0.5)'
                                                }}>
                                                    1
                                                </div>

                                                {/* 슬라이딩 텍스트
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: '-35px',
                                                    left: '0',
                                                    right: '0',
                                                    height: '25px',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    borderRadius: '12px',
                                                    border: '1px solid #e0e0e0',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                    zIndex: 1000
                                                }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        height: '100%',
                                                        whiteSpace: 'nowrap',
                                                        animation: 'slideText 8s linear infinite',
                                                        fontSize: '12px',
                                                        color: '#333',
                                                        fontWeight: '500',
                                                        padding: '0 15px'
                                                    }}>
                                                        💌 {newLetterContent}
                                                    </div>
                                                </div> */}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div >
            {showLetterArrival && newLetterData && (
                <div className={mainPageStyles.letterArrivalContainer}>
                    <div className={mainPageStyles.arrivingLetter}>
                        <img
                            src={leftWingImage}
                            alt="왼쪽 날개"
                            className={mainPageStyles.arrivingLeftWing}
                        />
                        <img
                            src={animationLetterImage}
                            alt="편지"
                            className={mainPageStyles.arrivingLetterImage}
                        />
                        <img
                            src={rightWingImage}
                            alt="오른쪽 날개"
                            className={mainPageStyles.arrivingRightWing}
                        />
                        {/* 추가 반짝이는 별들 */}
                        <div className={mainPageStyles.sparkle1} style={{
                            position: 'absolute',
                            top: '-50px',
                            left: '-50px',
                            fontSize: '20px',
                            animation: 'sparkleRotate 2s ease-in-out infinite',
                            animationDelay: '0s'
                        }}>⭐</div>
                        <div className={mainPageStyles.sparkle2} style={{
                            position: 'absolute',
                            bottom: '-50px',
                            right: '-50px',
                            fontSize: '20px',
                            animation: 'sparkleRotate 2s ease-in-out infinite',
                            animationDelay: '0.7s'
                        }}>✨</div>
                        <div className={mainPageStyles.sparkle3} style={{
                            position: 'absolute',
                            top: '-30px',
                            right: '30px',
                            fontSize: '20px',
                            animation: 'sparkleRotate 2s ease-in-out infinite',
                            animationDelay: '1.4s'
                        }}>💫</div>
                    </div>
                    <div className={mainPageStyles.letterArrivalMessage}>
                        새로운 편지가 도착했어요! 💌
                    </div>
                </div>
            )}
            <div
                className={mainPageStyles.scrollDownButton}
                onClick={handleScrollDown}
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
                <span ></span>
            </div>
            <div className={mainPageStyles.bottomFade}>
                <div className={mainPageStyles.stars}>
                    {stars}
                </div>
            </div>
            {/* 바뀐 부분 : CSS 애니메이션 스타일 추가 */}
            {/* 되야하는 동작 : 깜빡이는 숫자와 슬라이딩 텍스트 애니메이션 정의 */}
            {/* <style jsx>{`
                @keyframes blinkNumber {
                    0%, 50% { 
                        opacity: 1; 
                        transform: scale(1);
                    }
                    25% { 
                        opacity: 0.7; 
                        transform: scale(1.1);
                    }
                    75% { 
                        opacity: 0.8; 
                        transform: scale(0.95);
                    }
                }

                @keyframes slideText {
                    0% {
                        transform: translateX(100%);
                    }
                    10% {
                        transform: translateX(0%);
                    }
                    90% {
                        transform: translateX(0%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }

                @keyframes sparkleRotate {
                    0% { transform: rotate(0deg) scale(1); opacity: 0.8; }
                    50% { transform: rotate(180deg) scale(1.2); opacity: 1; }
                    100% { transform: rotate(360deg) scale(1); opacity: 0.8; }
                }
            `}</style> */}
        </div >
    );
}

export default MainPage;
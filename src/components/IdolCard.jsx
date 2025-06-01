import modalStyles from "../styles/IdolModal.module.css";

export default function IdolCard({
    imgUrl, group, name, count, showCallButton = true, onCall,
    groupClassName, nameClassName, countClassName, HeartIconClassName }) {

    return (
        <>
            {/* 수정 사항 : group, name, count부분을 main에서 따로 스타일 지정하려고 클래스 네임줘서 props로 보냄*/}
            <img className={modalStyles.idolImg} src={imgUrl} alt={name} />
            <div className={modalStyles.card}>
                <p className={groupClassName}>{group}</p>
                <div className={modalStyles.info}>
                    <h1 className={nameClassName}>{name}</h1>
                    {showCallButton && (
                        <button onClick={onCall}>
                            <i className="bi bi-telephone-fill"></i>
                        </button>
                    )}
                    <div className={modalStyles.hits}>
                        <p className={countClassName}>{count}</p>
                        <p className={HeartIconClassName}>♥️</p>
                    </div>
                </div>
            </div>
        </>
    );
}
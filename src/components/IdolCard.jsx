import modalStyles from "../styles/IdolModal.module.css";

export default function IdolCard({
    imgUrl, group, name, count, showCallButton = true, onCall,
    groupClassName, nameClassName, countClassName, HeartIconClassName }) {

    return (
        <>
            <img className={modalStyles.idolImg} src={imgUrl} alt={name} />

            <div className={modalStyles.card}>
                <div className={modalStyles.contentWrapper}>
                    <div className={modalStyles.nameGroupWrapper} style={{gap: "15px"}}>
                        <p className={groupClassName} style={{fontSize: "25px"}}>{group}</p>
                        <h1 className={nameClassName}>{name}</h1>
                    </div>
                    <div className={modalStyles.hits}>
                        <p className={countClassName}>{count}</p>
                        <p className={HeartIconClassName}>👀</p>
                    </div>
                </div>

                {showCallButton && (
                    <button className={modalStyles.centerButton} onClick={onCall}>
                        <i className="bi bi-telephone-fill"></i>
                    </button>
                )}
            </div>
        </>
    );
}
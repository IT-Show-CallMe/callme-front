import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from "../styles/IdolModal.module.css";


export default function IdolModal({imgUrl, group, name, count, onClose}) {
    return (
        <div className={styles.modalContainer} onClick={onClose}>
            <div className={styles.contentBox} onClick={(e) => e.stopPropagation()}>
                {/* <button className={styles.closeBtn} onClick={onClose}>×</button> */}
                <img className={styles.idolImg} src={imgUrl} alt={name} />
                <div className={styles.card}>
                    <p>{group}</p>
                    <div className={styles.info}>
                        <h1>{name}</h1>
                        <button><i className="bi bi-telephone-fill"></i></button>
                        <div className={styles.hits}>
                            <p>{count}</p>
                            <p>♥️</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
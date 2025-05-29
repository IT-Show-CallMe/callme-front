import { useState } from "react";
import styles from "../styles/IdolDetail.module.css";
import idolData from "../data/idolJson.json";

export default function IdolDetail() {
    const [idols, setIdols] = useState(idolData);

    const handleClick = (name) => {
        setIdols((prev) => ({
            ...prev,
            [name]: {
                ...prev[name],
                idolCount: prev[name].idolCount + 1,
            },
        }));
    };

    return (
        <div>
            <div className="searchBar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
                <input type="text" />
            </div>

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
        </div>
    );
}

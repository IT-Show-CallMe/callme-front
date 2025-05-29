import { useState } from "react";
import styles from "../styles/IdolDetail.module.css";
import idolData from "../data/idolJson.json";
import SearchBar from "../components/SearchBar";

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
        <div className={styles.idolDetailContainer}>
            <img src="images/back_short.png" alt="배경이미지" className="background-img" />

            <h1 className={styles.title}> pick your Idol </h1>

            <SearchBar />

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

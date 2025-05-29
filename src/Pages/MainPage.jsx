import React, { useState } from 'react';
import idolData from "../data/idolJson.json";
import SearchBar from "../components/SearchBar";
function MainPage() {
    const [keyword, setKeyword] = useState("");

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
        <div style={{
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "40px",
        }}>
            {/* <IdolCard />
            <LetterEnvelope /> */}
            <SearchBar
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
            />
        </div>
    );
}

export default MainPage;
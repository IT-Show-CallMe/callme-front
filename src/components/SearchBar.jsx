import "../styles/SearchBar.css";

function SearchBar({ value, onChange, placeholder = "검색어를 입력하세요", onClick }) {
    return (
        <div
            style={{
                display: "flex",
                width: "1080px",
                height: "50px",
                padding: "14px 27px",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
                borderRadius: "50px",
                background: "#FFF",
                boxShadow: "0px 0px 16px 0px rgba(0, 0, 0, 0.15)",
                cursor: onClick ? "pointer" : "auto",
                marginBottom: "50px",
            }}
            onClick={onClick}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                fill="#1564D6"
                style={{ marginRight: "16px", flexShrink: 0 }}
                viewBox="0 0 16 16"
            >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{
                    border: "none",
                    outline: "none",
                    fontSize: "1.15rem",
                    // color: "#222",
                    background: "transparent",
                    flex: 1,
                    color: "#BBB",
                    fontFamily: "Pretendard",
                    // fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 300,
                    lineHeight: "normal",
                }}
            />
        </div>
    );
}

export default SearchBar;

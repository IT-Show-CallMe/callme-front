import React from "react";
import "../css/HomePage.css";

const imagesFiles=[
    "images/mark_bg.png","images/mjh_bg.png","images/sw_bg.png","images/sh_bg.png","images/so_bg.png","images/yj_bg.png","images/wy_bg.png",
    "images/ys_bg.png","images/yuj_bg.png","images/lh_bg.png","images/jh_bg.png","images/krn_bg.png","images/hn_bg.png"
];  

function HomePage(){
    
    return(
        <div className="image-grid">
        {imagesFiles.map((File, i) => (
            <img 
            key={i}
            src={File}
            alt={`idol-${i}`}
            />
        ))}
        </div>
        
    );
}
export default HomePage;
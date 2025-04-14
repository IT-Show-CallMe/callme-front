import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../Pages/HomePage';
import LandingPage from '../Pages/Landing';
import NicknamePage from '../pages/Nickname';
// import MainPage from '../pages/Main/Home';
// import IdolDetailPage from '../pages/';
// import ConfirmNicknamePage from '../pages/VideoCall/ConfirmNicknamePage';
// import EmailAgreementPage from '../pages/';
// import EmailInputPage from '../pages/VideoCall/EmailInputPage';
// import VideoCallPage from '../pages/VideoCall/VideoCallPage';
// import LetterPage from '../pages/Letter/LetterPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/nickname" element={<NicknamePage />} />
            {/* <Route path="/main" element={<MainPage />} /> */}
            {/* <Route path="/idol/:idolId" element={<IdolDetailPage />} /> */}
            {/* <Route path="/call/confirm" element={<ConfirmNicknamePage />} /> */}
            {/* <Route path="/call/agreement" element={<EmailAgreementPage />} /> */}
            {/* <Route path="/call/email" element={<EmailInputPage />} /> */}
            {/* <Route path="/call/start" element={<VideoCallPage />} /> */}
            {/* <Route path="/letter" element={<LetterPage />} /> */}
        </Routes>
    );
};

export default AppRoutes;

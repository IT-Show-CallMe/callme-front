import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../Pages/HomePage';
import LandingPage from '../pages/Landing/LandingPage';
import NicknamePage from '../pages/Nickname/NicknamePage';
import MainPage from '../pages/Main/MainPage';
import IdolDetailPage from '../pages/IdolDetail/IdolDetailPage';

import ConfirmNicknamePage from '../pages/VideoCall/ConfirmNicknamePage';
import EmailAgreementPage from '../pages/VideoCall/EmailAgreementPage';
import EmailInputPage from '../pages/VideoCall/EmailInputPage';
import VideoCallPage from '../pages/VideoCall/VideoCallPage';

import LetterPage from '../pages/Letter/LetterPage';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />}/>
                <Route path="/" element={<LandingPage />} />
                <Route path="/nickname" element={<NicknamePage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/idol/:idolId" element={<IdolDetailPage />} />

                <Route path="/call/confirm" element={<ConfirmNicknamePage />} />
                <Route path="/call/agreement" element={<EmailAgreementPage />} />
                <Route path="/call/email" element={<EmailInputPage />} />
                <Route path="/call/start" element={<VideoCallPage />} />

                <Route path="/letter" element={<LetterPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;

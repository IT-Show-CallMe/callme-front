import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../Pages/Landing'; // 여원
import NicknamePage from '../Pages/Nickname'; //여원
import MainPage from '../Pages/MainPage'; // 가현
import IncallPage from '../Pages/Call/Incall'; // 현주
import CallIncomingPage from '../Pages/Call/CallIncomingPage'; // 현주
import CallEndedPage from '../Pages/Call/CallEndedPage'; // 현주
import LetterPage from '../Pages/Letter'; // 지은
import IdolDetailPage from '../Pages/IdolDetail'; // 지은
import EmailInputPage from '../Pages/EmailInput'; //여원

const AppRoutes = () => {
    return (
        <Routes>

            {/* <Route path="/" element={<HomePage />} /> */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/nickname" element={<NicknamePage />} />

            <Route path="/email" element={<EmailInputPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/letter" element={<LetterPage />} />
            <Route path="/call/Incall/:name" element={<IncallPage />} />
            <Route path="/call/incoming/:name" element={<CallIncomingPage />} />
            <Route path="/call/ended" element={<CallEndedPage />} />

            {/* <Route path="/idol/:idolId" element={<IdolDetailPage />} /> */}
            {/* <Route path="/call/confirm" element={<ConfirmNicknamePage />} /> */}
            {/* <Route path="/call/agreement" element={<EmailAgreementPage />} /> */}
            {/* <Route path="/call/email" element={<EmailInputPage />} /> */}
            {/* <Route path="/call/start" element={<VideoCallPage />} /> */}
        </Routes>
    );
};

export default AppRoutes;

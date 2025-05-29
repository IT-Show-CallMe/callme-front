import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../Pages/Landing'; // 여원
import NicknamePage from '../Pages/Nickname';
import MainPage from '../Pages/MainPage'; // 가현
import IncallPage from '../Pages/Call/Incall'; // 현주
import CallIncomingPage from '../Pages/Call/CallIncomingPage'; // 현주
import CallEndedPage from '../Pages/Call/CallEndedPage'; // 현주
import LetterPage from '../Pages/Letter'; // 지은
import IdolDetailPage from '../Pages/IdolDetail'; // 지은

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/nickname" element={<NicknamePage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/letter" element={<LetterPage />} />
            <Route path="/call/Incall" element={<IncallPage />} />
            <Route path="/call/incoming" element={<CallIncomingPage />} />
            <Route path="/call/ended" element={<CallEndedPage />} />
            <Route path="/idol" element={<IdolDetailPage />} />
        </Routes>
    );
};

export default AppRoutes;

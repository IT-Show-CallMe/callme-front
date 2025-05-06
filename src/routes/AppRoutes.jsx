import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import HomePage from '../Pages/HomePage';
import LandingPage from '../Pages/Landing';
// import NicknamePage from '../Pages/Nickname';
// import MainPage from '../Pages/Main';
// import SearchPage from '../Pages/Search';
// import IncallPage from '../Pages/Call/Incall';
// import CallIncomingPage from '../Pages/Call/CallIncomingPage';
// // import CallEndedPage from '../Pages/Call/CallEndedPage';
// import LetterPage from '../Pages/Letter';
// import ReviewPage from '../Pages/Review';

// import IdolDetailPage from '../pages/';
// import ConfirmNicknamePage from '../pages/VideoCall/ConfirmNicknamePage';
// import EmailAgreementPage from '../pages/';
// import EmailInputPage from '../pages/VideoCall/EmailInputPage';
// import VideoCallPage from '../pages/VideoCall/VideoCallPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* <Route path="/" element={<HomePage />} /> */}
            <Route path="/landing" element={<LandingPage />} />
            {/* <Route path="/nickname" element={<NicknamePage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/letter" element={<LetterPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/call/incal" element={<IncallPage />} />
            <Route path="/call/incoming" element={<CallIncomingPage />} />
            <Route path="/call/ended" element={<CallEndedPage />} /> */}
            {/* <Route path="/idol/:idolId" element={<IdolDetailPage />} /> */}
            {/* <Route path="/call/confirm" element={<ConfirmNicknamePage />} /> */}
            {/* <Route path="/call/agreement" element={<EmailAgreementPage />} /> */}
            {/* <Route path="/call/email" element={<EmailInputPage />} /> */}
            {/* <Route path="/call/start" element={<VideoCallPage />} /> */}
        </Routes>
    );
};

export default AppRoutes;
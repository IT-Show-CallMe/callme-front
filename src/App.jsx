// import React from "react";
// import HomePage from "./Pages/HomePage"; 

// function App() {
//   return (
//     <div>
//       <HomePage />
//     </div>
//   );
// }

// export default App;

// App.jsx가 아닌 라우트로 관리해보려고 해 다른 페이지들 추가는 AppRoutes.jsx에서 할거양
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <UserProvider>           {/* 전역 상태 */}
      <BrowserRouter>        {/* 라우터 */}
        <AppRoutes />        {/* 경로 설정 파일 */}
      </BrowserRouter>
    </UserProvider>
  );
}
export default App;
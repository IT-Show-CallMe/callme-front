# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 📁 폴더 구조
📦 src
┣ 📂 components         # 자주 쓰이는 UI 요소(버튼, 네비게이션 바 등)를 따로 모아서 재사용하는 요소들
┣ 📂 pages              # 화면 단위 컴포넌트 (ex. 로그인, 메인, 마이페이지)
┣ 📂 router             # 어떤 페이지가 어떤 URL에서 보여질지 정의
┃ ┗ 📄 AppRoutes.jsx    # 페이지와 경로를 연결하는 핵심 파일! 여기서 모든 라우팅 설정
┣ 📂 utils              # 날짜 포맷, API 호출 등 공용 유틸 함수
┣ 📂 context            # 전역 상태 관리용 (ex. 로그인 정보, 테마 등)
┗ 📄 App.jsx            # 앱 전체 구조 담당, 라우터와 공통 컴포넌트 포함    
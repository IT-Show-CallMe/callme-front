// 샘플 코드 ( 여기에는 전역 상태 관리하는 곳 - 닉네임, 선택 아이돌, 이메일 등 *App.jsx가서 감싸줘야함 )
import { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [nickname, setNickname] = useState('');
  const [idol, setIdol] = useState('');
  const [email, setEmail] = useState('');

  return (
    <UserContext.Provider value={{ nickname, setNickname, idol, setIdol, email, setEmail }}>
      {children}
    </UserContext.Provider>
  );
};

// 훅 생성 후 쓰기
export const useUser = () => useContext(UserContext);

// 만약 MainPage에서 닉네임을 쓰고 싶으면 
// import { useUser } from '../../context/UserContext'; 이걸 써주고
// import { useUser } from '../../context/UserContext';
// 이렇게 가져 오면 됨.
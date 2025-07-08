import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/FindAccount.css";

const FindAccount = () => {
  //아이디 찾기용 입력 상태
  const [idName, setIdName] = useState("");
  const [idEmail, setIdEmail] = useState("");
  const [userId, setUserId] = useState(null);

  //비밀번호 찾기용 입력 상태
  const [pwId, setPwId] = useState("");
  const [pwEmail, setPwEmail] = useState("");
  const [password, setPassword] = useState(null);

  const handleFindId = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u["이름"] === idName && u["이메일"] === idEmail
    );

    if (user) {
      setUserId(user["회원id"]);
      setPassword(null); // 다른 결과 초기화
    } else {
      alert("일치하는 회원 정보가 없습니다.");
      setUserId(null);
    }
  };

  const handleFindPassword = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u["회원id"] === pwId && u["이메일"] === pwEmail
    );

    if (user) {
      setPassword(user["비밀번호"]);
      setUserId(null); // 다른 결과 초기화
    } else {
      alert("일치하는 회원 정보가 없습니다.");
      setPassword(null);
    }
  };

  return (
    <div className="find-account-container">
      <div className="find-account-box">
        <h1>회원정보 찾기</h1>

        <div className="find-box">
          <h3>아이디 찾기</h3>
          <input
            type="text"
            placeholder="이름"
            value={idName}
            onChange={(e) => setIdName(e.target.value)}
          />
          <input
            type="email"
            placeholder="이메일"
            value={idEmail}
            onChange={(e) => setIdEmail(e.target.value)}
          />
          <button onClick={handleFindId}>아이디 찾기</button>
          {userId && (
            <p>
              가입된 아이디: <strong>{userId}</strong>
            </p>
          )}
        </div>

        <div className="find-box">
          <h3>비밀번호 찾기</h3>
          <input
            type="text"
            placeholder="아이디"
            value={pwId}
            onChange={(e) => setPwId(e.target.value)}
          />
          <input
            type="email"
            placeholder="이메일"
            value={pwEmail}
            onChange={(e) => setPwEmail(e.target.value)}
          />
          <button onClick={handleFindPassword}>비밀번호 찾기</button>
          {password && (
            <p>
              비밀번호: <strong>{password}</strong>
            </p>
          )}
        </div>

        <Link to="/login">로그인으로 돌아가기</Link>
      </div>
    </div>
  );
};

export default FindAccount;

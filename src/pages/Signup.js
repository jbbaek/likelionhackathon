import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    회원id: "",
    이름: "",
    이메일: "",
    비밀번호: "",
    비밀번호확인: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.비밀번호 !== formData.비밀번호확인) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 기존 회원 목록 가져오기
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    // 아이디 중복 검사
    const idExists = existingUsers.some(
      (user) => user["회원id"] === formData.회원id
    );
    if (idExists) {
      alert("이미 사용 중인 아이디입니다.");
      return;
    }

    // 새 사용자 추가
    const updatedUsers = [...existingUsers, formData];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("회원가입이 완료되었습니다.");
    navigate("/login");
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h1>hackathon</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>아이디</label>
            <input
              type="text"
              name="회원id"
              value={formData.회원id}
              onChange={handleChange}
              placeholder="아이디 (10자 이내)"
              required
            />
          </div>
          <div className="form-group">
            <label>이름</label>
            <input
              type="text"
              name="이름"
              value={formData.이름}
              onChange={handleChange}
              placeholder="이름"
              required
            />
          </div>
          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              name="이메일"
              value={formData.이메일}
              onChange={handleChange}
              placeholder="이메일 주소"
              required
            />
            <button type="button" className="verify-code-btn">
              인증코드 발송
            </button>
          </div>
          <div className="form-group">
            <label>인증번호</label>
            <input type="text" name="인증번호" placeholder="인증번호 입력" />
            <button type="button" className="verify-code-btn">
              인증 확인
            </button>
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="비밀번호"
              value={formData.비밀번호}
              onChange={handleChange}
              placeholder="비밀번호"
              required
            />
          </div>
          <div className="form-group">
            <label>비밀번호 확인</label>
            <input
              type="password"
              name="비밀번호확인"
              value={formData.비밀번호확인}
              onChange={handleChange}
              placeholder="비밀번호 확인"
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="signup-btn">
              회원가입
            </button>
          </div>
        </form>
        <div className="signup-footer">
          <div>
            <span>이미 회원이라면?</span>
            <Link to="/login">로그인</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

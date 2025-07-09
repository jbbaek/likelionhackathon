import React, { useState } from "react";
import "../css/FindAccount.css";

const FindPassword = () => {
  const [isVerified, setIsVerified] = useState(false); // 인증 성공 여부

  const handleVerifyCode = () => {
    // 실제 로직은 없으므로 임의로 인증 성공 처리
    setIsVerified(true);
    alert("인증이 확인되었습니다!");
  };

  return (
    <div className="find-account-container">
      <div className="find-account-box">
        <h1>비밀번호 찾기</h1>

        <div className="form-group">
          <label>아이디</label>
          <input type="text" name="userId" placeholder="아이디 입력" />
        </div>

        <div className="form-group">
          <label>이메일</label>
          <input type="email" name="email" placeholder="이메일 입력" />
          <button type="button" className="send-code-btn">
            인증코드 발송
          </button>
        </div>

        <div className="form-group">
          <label>인증번호</label>
          <input type="text" name="authCode" placeholder="인증번호 입력" />
          <button
            type="button"
            className="verify-code-btn"
            onClick={handleVerifyCode}
          >
            인증 확인
          </button>
        </div>

        {/*인증 완료 시 아래 입력칸 보이기 */}
        {isVerified && (
          <div className="form-group">
            <label>새 비밀번호</label>
            <input
              type="password"
              name="newPassword"
              placeholder="새 비밀번호 입력"
            />
            <button type="button" className="reset-password-btn">
              비밀번호 재설정
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindPassword;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/PostPage.css";

const PostDetailPage = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { id: 1, author: "user456", text: "이 게시글 정말 좋아요!" },
    { id: 2, author: "admin", text: "관리자가 남긴 댓글" },
  ]);

  // 댓글 추가
  const handleAddComment = () => {
    if (!comment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    const newComment = {
      id: Date.now(),
      author: "user123", // 임시 작성자
      text: comment,
    };

    setComments([newComment, ...comments]);
    setComment(""); // 입력창 초기화
  };

  // 댓글 삭제
  const handleDeleteComment = (id) => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    const updatedComments = comments.filter((c) => c.id !== id);
    setComments(updatedComments);
  };

  return (
    <div className="container">
      <h2>게시글 상세</h2>

      <div className="post-box">
        <h3>게시글 제목</h3>
        <p>게시글 내용이 여기에 표시됩니다.</p>
        <p>작성자: user123</p>

        <Link to="/editpostpage">
          <button>수정</button>
        </Link>
        <Link to="/deletepostpage">
          <button>삭제</button>
        </Link>
      </div>

      <hr />

      {/* 댓글 작성 */}
      <div className="comment-write">
        <h4>댓글 작성</h4>
        <textarea
          placeholder="댓글을 입력하세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleAddComment}>댓글 작성</button>
      </div>

      {/* 댓글 목록 */}
      <div className="comment-list">
        <h4>댓글 목록</h4>
        {comments.map((c) => (
          <div key={c.id} className="comment-item">
            <p>
              {c.author}: {c.text}
            </p>
            <Link to="/editcommentpage">
              <button>수정</button>
            </Link>
            <button onClick={() => handleDeleteComment(c.id)}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDetailPage;

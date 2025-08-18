import React, { useState, useEffect } from "react";
import "../css/MyPage.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

//감정 순서를 고정 배열로 선언
const emotionList = [
  "기쁨",
  "편안",
  "안정",
  "평온",
  "당황",
  "외로움",
  "슬픔",
  "우울",
  "상처",
  "불안",
  "두려움",
  "혐오",
  "분노",
];

// 감정별 색상
const emotionColors = {
  기쁨: "rgba(255, 206, 86, 0.7)",
  편안: "rgba(200, 180, 255, 0.7)",
  안정: "rgba(120, 200, 120, 0.7)",
  평온: "rgba(75, 192, 192, 0.7)",
  당황: "rgba(255, 159, 64, 0.7)",
  외로움: "rgba(213, 56, 252, 0.7)",
  슬픔: "rgba(100, 100, 200, 0.7)",
  우울: "rgba(50, 50, 150, 0.7)",
  상처: "rgba(250, 255, 102, 0.7)",
  불안: "rgba(54, 162, 235, 0.7)",
  두려움: "rgba(0, 200, 200, 0.7)",
  혐오: "rgba(150, 75, 0, 0.7)",
  분노: "rgba(255, 99, 132, 0.7)",
};

const MyPage = () => {
  const [selectedContent, setSelectedContent] = useState("힐링 기록 보기");
  const [spots, setSpots] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newSpot, setNewSpot] = useState({
    name: "",
    beforeEmotion: "",
    afterEmotion: "",
  });
  const [selectedMonth, setSelectedMonth] = useState("");

  // ✅ 로컬 기준 YYYY-MM-DD (하루 밀림 방지)
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // 최초 로드: localStorage에서 spots/posts 불러오기 (없으면 빈 배열 유지)
  useEffect(() => {
    const savedSpots = JSON.parse(localStorage.getItem("spots") || "[]");
    const savedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    setSpots(savedSpots);
    if (savedPosts.length > 0) {
      setPosts(savedPosts);
    } else {
      const dummyPosts = [
        { title: "호수공원 산책 너무 좋았어요", date: "2025-07-21" },
        { title: "카페에서 감정 일기 쓰기 후기", date: "2025-07-15" },
      ];
      setPosts(dummyPosts);
      localStorage.setItem("posts", JSON.stringify(dummyPosts));
    }
  }, []);

  // 저장 시 항상 localStorage 반영
  useEffect(() => {
    localStorage.setItem("spots", JSON.stringify(spots));
  }, [spots]);
  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const handleSaveRecord = () => {
    if (
      !newSpot.name ||
      !newSpot.afterEmotion ||
      !newSpot.beforeEmotion ||
      !selectedDate
    )
      return;
    const newDate = formatDate(selectedDate); // 로컬 날짜 사용
    const updated = [...spots, { ...newSpot, date: newDate }];
    setSpots(updated);
    setNewSpot({ name: "", beforeEmotion: "", afterEmotion: "" });
    setSelectedDate(null);
  };

  const sortedSpots = [...spots].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // 꺾은선 그래프: y값을 "감정 문자열"로 직접 사용 (매핑 오류 원천 차단)
  const lineData = {
    datasets: [
      {
        label: "이후 감정 변화",
        data: sortedSpots.map((s) => ({ x: s.date, y: s.afterEmotion })), // ← 문자열로 직접
        parsing: { xAxisKey: "x", yAxisKey: "y" },
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.3)",
        tension: 0.3,
        pointBackgroundColor: sortedSpots.map(
          (s) => emotionColors[s.afterEmotion]
        ),
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    scales: {
      x: { type: "category", title: { display: true, text: "날짜" } },
      y: {
        type: "category",
        labels: emotionList, // 고정 배열
        title: { display: true, text: "감정" },
      },
    },
  };

  // 막대 그래프 데이터
  const monthlyCounts = {};
  sortedSpots.forEach((s) => {
    const month = s.date.slice(0, 7);
    if (!monthlyCounts[month]) monthlyCounts[month] = {};
    monthlyCounts[month][s.afterEmotion] =
      (monthlyCounts[month][s.afterEmotion] || 0) + 1;
  });
  const months = Object.keys(monthlyCounts).sort();
  useEffect(() => {
    if (months.length > 0 && !selectedMonth) {
      setSelectedMonth(months[months.length - 1]);
    }
  }, [months, selectedMonth]);

  const barLabels = Object.keys(monthlyCounts[selectedMonth] || {});
  const barValues = Object.values(monthlyCounts[selectedMonth] || {});
  const barColors = barLabels.map(
    (e) => emotionColors[e] || "rgba(200,200,200,0.7)"
  );
  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: `${selectedMonth} 감정 빈도`,
        data: barValues,
        backgroundColor: barColors,
      },
    ],
  };

  return (
    <div className="mypage-container">
      <h2 className="mypage-subtitle">내 감정 케어</h2>

      <div className="profile-row">
        <div className="profile-icon-box">
          <FontAwesomeIcon icon={faCircleUser} className="profile-icon" />
        </div>
        <div className="profile-info-box">
          <p>
            <strong>이름:</strong> 사용자
          </p>
          <p>
            <strong>이메일:</strong> example@goyang.com
          </p>
          <p>
            <strong>가입일:</strong> 2025-07-01
          </p>
        </div>
      </div>

      <div className="mypage-body">
        <div className="mypage-sidebar">
          <p onClick={() => setSelectedContent("힐링 기록 보기")}>
            힐링 기록 보기
          </p>
          <p onClick={() => setSelectedContent("감정 히스토리")}>
            감정 히스토리
          </p>
          <p onClick={() => setSelectedContent("내가 작성한 후기")}>
            내가 작성한 후기
          </p>
          <p onClick={() => setSelectedContent("회원 탈퇴")}>회원 탈퇴</p>
        </div>

        <div className="mypage-content">
          <h3 className="content-title">{selectedContent}</h3>

          {/* 힐링 기록 보기 */}
          {selectedContent === "힐링 기록 보기" && (
            <div>
              <p>나의 감정 회복을 위해 방문한 날짜와 장소입니다.</p>
              <Calendar
                onClickDay={(date) => setSelectedDate(date)}
                tileContent={({ date }) => {
                  const match = spots.find(
                    (spot) => spot.date === formatDate(date)
                  ); // 로컬 날짜 비교
                  return match ? (
                    <div className="calendar-emotion">
                      <p>{match.name}</p>
                      <p>{match.afterEmotion}</p>
                    </div>
                  ) : null;
                }}
              />

              {selectedDate && (
                <div className="calendar-form">
                  <h4>{formatDate(selectedDate)} 기록 추가</h4>
                  <input
                    type="text"
                    placeholder="장소명 입력"
                    value={newSpot.name}
                    onChange={(e) =>
                      setNewSpot({ ...newSpot, name: e.target.value })
                    }
                  />
                  <select
                    value={newSpot.beforeEmotion || ""}
                    onChange={(e) =>
                      setNewSpot({ ...newSpot, beforeEmotion: e.target.value })
                    }
                  >
                    <option value="" disabled hidden>
                      이전 감정 선택
                    </option>
                    {emotionList.map((emo) => (
                      <option key={emo} value={emo}>
                        {emo}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newSpot.afterEmotion || ""}
                    onChange={(e) =>
                      setNewSpot({ ...newSpot, afterEmotion: e.target.value })
                    }
                  >
                    <option value="" disabled hidden>
                      이후 감정 선택
                    </option>
                    {emotionList.map((emo) => (
                      <option key={emo} value={emo}>
                        {emo}
                      </option>
                    ))}
                  </select>
                  <button onClick={handleSaveRecord}>기록 저장</button>
                </div>
              )}
            </div>
          )}

          {/* 감정 히스토리 */}
          {selectedContent === "감정 히스토리" && (
            <div>
              <p>최근 감정 변화 히스토리 </p>
              <Line data={lineData} options={lineOptions} />

              <p style={{ marginTop: "30px" }}>한 달 동안 감정 빈도</p>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ marginBottom: "15px" }}
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <Bar data={barData} />
            </div>
          )}

          {/* 내가 작성한 후기 */}
          {selectedContent === "내가 작성한 후기" && (
            <div className="review-card-container">
              {posts.map((post, idx) => (
                <div className="review-card" key={idx}>
                  <h4>{post.title}</h4>
                  <p>{post.date}</p>
                </div>
              ))}
            </div>
          )}

          {/* 회원 탈퇴 */}
          {selectedContent === "회원 탈퇴" && (
            <div className="withdraw-section">
              <p
                style={{
                  marginBottom: "20px",
                  color: "#cc0000",
                  fontWeight: "bold",
                }}
              >
                ⚠️ 탈퇴 시 모든 감정 기록 및 힐링 히스토리가 삭제됩니다.
              </p>
              <button
                className="withdraw-button"
                onClick={() => {
                  localStorage.clear();
                  setSpots([]);
                  setPosts([]);
                }}
              >
                회원 탈퇴
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;

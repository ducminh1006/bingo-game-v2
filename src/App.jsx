import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import InfoPanel from "./components/InfoPanel";
import TimeDisplay from "./components/TimeDisplay";
import StartScreen from "./components/StartScreen";
import BingoBoard from "./components/BingoBoard";
import SummaryScreen from "./components/SummaryScreen";
import questions from "./data/questions";
import questionsLevel2 from "./data/questionsLevel2";
import questionsLevel4 from "./data/questionsLevel4";
import QuestionModal from "./components/QuestionModal";
import "./App.css";
import "./components/StartScreen.css";

const generateInitialBoard = () => {
  const levels = [
    [1, 2, 2, 4],
    [2, 4, 2, 1],
    [2, 1, 4, 2],
    [4, 2, 1, 2],
  ];
  return levels.map((row, i) =>
    row.map((level, j) => ({
      level,
      points: level,
      status: null,
      position: [i, j],
    }))
  );
};

export default function App() {
  const LOCAL_STORAGE_KEY = "bingoGameState";

  const saveGameState = (state) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  };

  const loadGameState = () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  };

  const clearGameState = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const [started, setStarted] = useState(false);
  const [team, setTeam] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [boardData, setBoardData] = useState(generateInitialBoard());
  const [showModal, setShowModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentCell, setCurrentCell] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [bingoWon, setBingoWon] = useState(false);

  // ✅ Load trạng thái nếu có
  useEffect(() => {
    const saved = loadGameState();
    if (saved) {
      setTeam(saved.team);
      setStarted(true);
      setBoardData(saved.boardData);
      setScore(saved.score);
      setStartTime(saved.startTime);
      setElapsed(saved.elapsed);
    }
  }, []);

  // ✅ Tự động lưu trạng thái mỗi khi có thay đổi quan trọng
  useEffect(() => {
    if (!started || gameOver) return;
    saveGameState({
      team,
      boardData,
      score,
      startTime,
      elapsed,
    });
  }, [team, boardData, score, startTime, elapsed, started, gameOver]);

  useEffect(() => {
    if (!started || gameOver) return;

    const allAnswered = boardData.every((row) =>
      row.every((cell) => cell.status !== null)
    );

    const hasBingo = checkBingo(boardData);

    if (hasBingo) {
      setTimeout(() => {
        setGameOver(true);
        setBingoWon(true);
        clearGameState();
      }, 1500);
      return;
    }

    if (allAnswered && !hasBingo) {
      setGameOver(true);
      setBingoWon(false);
      clearGameState();
    }
  }, [boardData, started, gameOver]);

  useEffect(() => {
    let interval;

    if (started && startTime === null) {
      const now = Date.now();
      setStartTime(now);
    }

    if (started && !gameOver) {
      interval = setInterval(() => {
        const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsed(timeElapsed);

        if (timeElapsed >= 600) {
          setGameOver(true);
          setBingoWon(false);
          clearInterval(interval);
          clearGameState();
        }
      }, 1000);
    }

    if (gameOver) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [started, startTime, gameOver]);

  const formatTime = () => {
    const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const secs = String(elapsed % 60).padStart(2, "0");
    return `${mins}'${secs}''`;
  };

  const checkBingo = (board) => {
    for (let row = 0; row < 4; row++) {
      if (board[row].every((cell) => cell.status === "correct")) {
        return true;
      }
    }
    for (let col = 0; col < 4; col++) {
      const column = board.map((row) => row[col]);
      if (column.every((cell) => cell.status === "correct")) {
        return true;
      }
    }
    return false;
  };

  const handleCellClick = (row, col) => {
    const cell = boardData[row][col];
    setCurrentCell({ row, col });
    if (cell.status !== null) return;

    const posKey = `${row}-${col}`;
    let question;

    if (cell.level === 1) {
      question = questions.find((q) => q.position === posKey);
    } else if (cell.level === 2) {
      question = questionsLevel2.find((q) => q.position === posKey);
    } else if (cell.level === 4) {
      question = questionsLevel4.find((q) => q.position === posKey);
    }

    if (question) {
      setCurrentQuestion(question);
      setShowModal(true);
    }
  };

  const handleAnswer = (isCorrect) => {
    const { row, col } = currentCell;
    const newBoard = [...boardData];
    newBoard[row][col].status = isCorrect ? "correct" : "wrong";

    if (isCorrect) {
      setScore((prev) => prev + boardData[row][col].points);
    }

    setBoardData(newBoard);
  };

  if (gameOver) {
    return (
      <SummaryScreen
        team={team}
        time={formatTime()}
        score={score}
        bingoWon={bingoWon}
      />
    );
  }

  if (!started) {
    return (
      <div className="start-background">
        <div className="overlay">
          <Header />
          <StartScreen
            onStart={(teamNumber) => {
              const saved = loadGameState();
              if (saved && saved.team === teamNumber) {
                setTeam(saved.team);
                setStarted(true);
                setBoardData(saved.boardData);
                setScore(saved.score);
                setStartTime(saved.startTime);
                setElapsed(saved.elapsed);
              } else {
                setTeam(teamNumber);
                setBoardData(generateInitialBoard());
                setScore(0);
                setElapsed(0);
                setStarted(true);
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app-background">
      <div className="app-overlay">
        <Header />
        <TimeDisplay time={formatTime()} />
        <InfoPanel teamNumber={team} score={score} time={formatTime()} />
        <BingoBoard boardData={boardData} onCellClick={handleCellClick} />
        {showModal && currentQuestion && (
          <QuestionModal
            question={currentQuestion}
            onClose={() => setShowModal(false)}
            onAnswer={handleAnswer}
          />
        )}
      </div>
    </div>
  );
}

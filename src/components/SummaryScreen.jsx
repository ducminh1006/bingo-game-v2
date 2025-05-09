import React from "react";
import "./SummaryScreen.css";

export default function SummaryScreen({ team, time, score, bingoWon }) {
  return (
    <div className="summary-wrapper">
      <div className="summary-container">
        <h1>🎯 MEDSHIP 2025 - Neuroverse</h1>
        <h2>Team's number: {team}</h2>
        <h2>Time: {time}</h2>
        <h2>Score: {score}</h2>
        <h2>
          {bingoWon
            ? "🎉 Bingo! You have completed the game!"
            : "⏱ Time out! – You have not completed the game!"}
        </h2>
      </div>
    </div>
  );
}

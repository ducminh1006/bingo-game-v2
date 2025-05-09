import React from "react";
import "./BingoCell.css";

const getColorFromLevel = (level) => {
  if (level === 1) return "#4CAF50"; // xanh lá
  if (level === 2) return "#FFD700"; // vàng
  if (level === 4) return "#F44336"; // đỏ
  return "#ccc";
};

const BingoCell = ({ value, onClick }) => {
  const { level, status, points } = value;

  const cellStyle = {
    backgroundColor: getColorFromLevel(level),
    cursor: "pointer",
    color: "white",
    fontWeight: "bold",
    border: "2px solid #fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  let symbol = "";
  if (status === "correct") symbol = "O";
  else if (status === "wrong") symbol = "X";
  else symbol = `${points}`;

  return (
    <div className="bingo-cell" style={cellStyle} onClick={onClick}>
      {symbol}
    </div>
  );
};

export default BingoCell;

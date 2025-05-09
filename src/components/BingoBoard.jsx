import React from "react";
import BingoCell from "./BingoCell";
import "./BingoBoard.css";

const BingoBoard = ({ boardData, onCellClick }) => {
  return (
    <div className="bingo-board-wrapper">
      <div className="bingo-board">
        {boardData.map((row, rowIndex) => (
          <div className="bingo-row" key={rowIndex}>
            {row.map((cell, colIndex) => (
              <BingoCell
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                onClick={() => onCellClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BingoBoard;

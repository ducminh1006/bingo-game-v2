import React from "react";
import "./InfoPanel.css";

const InfoPanel = ({ teamNumber, score, time }) => (
  <div className="info-panel">
    <h3>
      <strong>TEAM NUMBER</strong>
    </h3>
    <p>{teamNumber || "--"}</p>
    <h4>
      <strong>SCORE</strong>
    </h4>
    <p>{score} POINTS</p>
    <h4>
      <strong>TIME</strong>
    </h4>
    <p>{time}</p>
  </div>
);

export default InfoPanel;

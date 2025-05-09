import React, { useState } from "react";

const StartScreen = ({ onStart }) => {
  const [team, setTeam] = useState("");

  return (
    <div style={{ textAlign: "center", marginTop: "100px", color: "white" }}>
      <input
        placeholder="Type your Team's number"
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        style={{ fontSize: "20px", padding: "5px", marginBottom: "20px" }}
      />
      <br />
      <button
        onClick={() => {
          if (!team.trim()) {
            alert("Vui lòng nhập số đội trước khi bắt đầu!");
            return;
          }
          onStart(team);
        }}
        style={{
          backgroundColor: "green",
          color: "white",
          fontSize: "24px",
          padding: "10px 20px",
          marginTop: "20px",
          cursor: "pointer",
        }}
      >
        START
      </button>
    </div>
  );
};

export default StartScreen;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import NavbarComponent from "./Component/NavbarComponent";
import ChatbotComponent from "./Component/ChatbotComponent";

function LandingPage() {
  const [inputId, setInputId] = useState("");
  const [searchType, setSearchType] = useState("match"); // or 'player'
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setInputId(event.target.value);
  };

  const handleSubmit = async () => {
    // Construct the API URL
    const apiUrl = `https://y3gdfwezvd.execute-api.us-east-1.amazonaws.com/dev/matches/${inputId}`;
    console.log(apiUrl);

    try {
      // Make the API request
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Parsed JSON data:", data);

      navigate("/match-details", { state: data });
    } catch (error) {
      console.error("Failed to fetch match data:", error);
    }
  };

  return (
    <div className="landing-page">
      <h1 className="title">STATS</h1>
      <div className="search-bar">
        <select
          className="type-selector"
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="match">Match ID</option>
          <option value="player">Player ID</option>
        </select>
        <input
          className="search-input"
          type="text"
          placeholder="Enter ID"
          value={inputId}
          onChange={handleInputChange}
        />
        <button className="search-button" onClick={handleSubmit}>
          Search
        </button>
      </div>
      <div className="fixed bottom-0 right-0 mb-4 mr-4">
        <ChatbotComponent />
      </div>
    </div>
  );
}

export default LandingPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SavedMatches.css";

function SavedMatches() {
  const [savedMatches, setSavedMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSavedMatches() {
      const userEmail = localStorage.getItem("userEmail");
      const apiUrl = `https://y3gdfwezvd.execute-api.us-east-1.amazonaws.com/dev/savedgames?email=${encodeURIComponent(
        userEmail
      )}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.saved_matches) {
          setSavedMatches(data.saved_matches);
        }
      } catch (error) {
        console.error("Failed to fetch saved matches:", error);
      }
    }

    fetchSavedMatches();
  }, []);

  const handleMatchClick = async (matchId) => {
    // Navigate to match details page with the match ID
    const matchDetailsUrl = `https://y3gdfwezvd.execute-api.us-east-1.amazonaws.com/dev/matches/${matchId}`;
    console.log(matchDetailsUrl);

    try {
      // Make the API request
      const response = await fetch(matchDetailsUrl);
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
    <div className="saved-matches">
      <h2 className="title">Saved Matches</h2>
      <div className="matches-container">
        {savedMatches.map((matchId, index) => (
          <div
            key={index}
            className="match-card"
            onClick={() => handleMatchClick(matchId)}
          >
            Match ID: {matchId}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedMatches;

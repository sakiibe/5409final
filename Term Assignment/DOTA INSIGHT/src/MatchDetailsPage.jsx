import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./MatchDetails.css";
import { useToast, Button } from "@chakra-ui/react";
import axios from "axios";

function MatchDetails() {
  const location = useLocation();
  const [matchData, setMatchData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    // Set the match data from the location state
    const data = location.state?.result;
    setMatchData(data);
  }, [location.state]);
  const handleSaveMatch = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      const response = await axios.post(
        "https://y3gdfwezvd.execute-api.us-east-1.amazonaws.com/dev/savedgames",
        {
          email: userEmail,
          matchId: matchData.match_id,
        }
      );

      toast({
        title: "Match Saved",
        description: "The match has been saved to your profile.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving match:", error);
      toast({
        title: "Error",
        description: "There was an issue saving the match.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  if (!matchData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="match-details">
      <h2 className="title">{matchData.matchOutcome}</h2>
      <div className="team">
        <h3>The Radiant</h3>
        {matchData.teams.radiant.map((player, index) => (
          <div key={index} className="player">
            <div className="player-name">
              {player.playerName || "Anonymous"}{" "}
              {/* If playerName is null/empty, set to "Anonymous" */}
            </div>
            <div className="stats">
              <span>Kills: {player.stats.K}</span>
              <span>Deaths: {player.stats.D}</span>
              <span>Assists: {player.stats.A}</span>
              <span> NW: {player.stats.NET}</span>
              <span>LH/DN: {player.stats.LH_DN}</span>
              <span>GPM: {player.stats.GPM}</span>
              <span>Damage: {player.stats.DMG}</span>
              <span>Heal: {player.stats.HEAL}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="team">
        <h3>The Dire</h3>
        {matchData.teams.dire.map((player, index) => (
          <div key={index} className="player">
            <div className="player-name">
              {player.playerName || "Anonymous"}{" "}
              {/* If playerName is null/empty, set to "Anonymous" */}
            </div>
            <div className="stats">
              <span>Kills: {player.stats.K}</span>
              <span>Deaths: {player.stats.D}</span>
              <span>Assists: {player.stats.A}</span>
              <span> NW: {player.stats.NET}</span>
              <span>LH/DN: {player.stats.LH_DN}</span>
              <span>GPM: {player.stats.GPM}</span>
              <span>Damage: {player.stats.DMG}</span>
              <span>Heal: {player.stats.HEAL}</span>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={handleSaveMatch} colorScheme="blue">
        Save Match
      </Button>
    </div>
  );
}

export default MatchDetails;
